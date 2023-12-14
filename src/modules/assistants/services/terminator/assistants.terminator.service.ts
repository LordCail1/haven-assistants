import { Assistant } from 'openai/resources/beta/assistants/assistants';
import { AssistantName } from '../../enums/enums';
import { AssistantsAbstractService } from '../assistants.abstract.service';
import { Gpt_Models } from 'src/modules/openai/enums/enums';
import { ImageNotTextException } from 'src/shared/exceptions/image-not-text.exception';
import { Injectable } from '@nestjs/common';
import { Run } from 'openai/resources/beta/threads/runs/runs';
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages';
import {
  Thread,
  ThreadCreateParams,
} from 'openai/resources/beta/threads/threads';

/**
 * This service is responsible for the 'Terminator' assistant.
 * The 'Terminator' assistant is responsible for determining if the story is good enough.
 */
@Injectable()
export class AssistantsTerminatorService extends AssistantsAbstractService {
  private assistant: Assistant;

  getAssistant(): Assistant {
    return this.assistant;
  }

  async initializeAssistant(): Promise<void> {
    const assistant: Assistant | undefined =
      await this.checkIfAssistantAlreadyExists(AssistantName.TERMINATOR);
    if (assistant) {
      await this.openaiAssistantsService.deleteAssistant(assistant.id);
    }

    const instructions = await this.loadInstructions(
      __dirname,
      'v2/instructions.txt',
      AssistantName.TERMINATOR,
    );

    const description = await this.loadDescription(
      __dirname,
      'description.txt',
      AssistantName.TERMINATOR,
    );

    this.assistant = await this.openaiAssistantsService.createAssistant({
      name: AssistantName.TERMINATOR,
      description,
      instructions,
      model: Gpt_Models.GPT_4_TURBO_1106_PREVIEW,
    });
  }

  /**
   * This method is responsible for determining if the story is good enough.
   * @param threadId - thread id that is used to identify the conversation between the refugee and the 'questioner'.
   * @returns - true if the story is good enough, false otherwise.
   */
  async determineIfStoryIsGoodEnough(threadId: string): Promise<boolean> {
    const threadMessages: ThreadMessage[] =
      await this.openaiMessagesService.listMessages(threadId);

    threadMessages.pop();

    const messages: ThreadCreateParams.Message[] =
      await this.helpersService.convertThreadMessagesToMessageArray(
        threadMessages,
      );

    const thread: Thread = await this.openaiThreadsService.createThread({
      messages,
    });

    const run: Run = await this.openaiRunsService.createRun(
      thread.id,
      this.assistant.id,
    );

    await this.openaiRunsService.retrieveRun(thread.id, run.id);

    const terminatorThreadMessages: ThreadMessage[] =
      await this.openaiMessagesService.listMessages(thread.id);

    if ('text' in terminatorThreadMessages[0].content[0]) {
      const terminatorResponseText: string =
        terminatorThreadMessages[0].content[0].text.value;

      const isStoryGoodEnough: boolean =
        this.helpersService.parseLastResponseForJson(terminatorResponseText);

      if (isStoryGoodEnough) {
        return true;
      } else {
        return false;
      }
    } else {
      throw new ImageNotTextException();
    }
  }
}
