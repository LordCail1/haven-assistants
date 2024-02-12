import { Assistant } from 'openai/resources/beta/assistants/assistants';
import { AssistantName } from '../../enums/enums';
import { AssistantsAbstractService } from '../assistants.abstract.service';
import { DetermineStoryGoodEnoughException } from '../../exceptions/terminator/determine-story-good-enough.exception';
import { GettingAssistantException } from '../../exceptions/geting-assistant.exception';
import { Gpt_Models } from 'src/modules/openai/enums/enums';
import { ImageNotTextException } from 'src/shared/exceptions/image-not-text.exception';
import { InitializingAssistantException } from '../../exceptions/initializing-assistant.exception';
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
    if (this.assistant) {
      return this.assistant;
    } else {
      throw new GettingAssistantException(AssistantName.TERMINATOR);
    }
  }

  async initializeAssistant(): Promise<void> {
    try {
      const assistant: Assistant | undefined =
        await this.checkIfAssistantAlreadyExists(AssistantName.TERMINATOR);
      if (assistant) {
        await this.openaiAssistantsService.deleteAssistant(assistant.id);
      }

      const instructions = await this.loadInstructions(
        __dirname,
        'v4/instructions.txt',
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
    } catch (error) {
      throw new InitializingAssistantException(AssistantName.TERMINATOR, error);
    }
  }

  /**
   * This method is responsible for determining if the story is good enough.
   * @param threadId Thread id that is used to identify the conversation between the refugee and the 'questioner'.
   * @returns True if the story is good enough, false otherwise.
   */
  async determineIfStoryIsGoodEnough(threadId: string): Promise<boolean> {
    try {
      const threadMessages: ThreadMessage[] =
        await this.openaiMessagesService.listMessages(threadId);

      const messages: ThreadCreateParams.Message[] =
        this.helpersService.convertThreadMessagesToMessageArray(threadMessages);

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
        console.log(terminatorResponseText);

        const isStoryGoodEnough: boolean =
          this.helpersService.parseTerminatorResponseForJson(
            terminatorResponseText,
          );

        if (isStoryGoodEnough) {
          return true;
        } else {
          return false;
        }
      } else {
        throw new ImageNotTextException();
      }
    } catch (error) {
      throw new DetermineStoryGoodEnoughException(error);
    }
  }
}
