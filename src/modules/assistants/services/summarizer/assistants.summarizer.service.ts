import { Assistant } from 'openai/resources/beta/assistants/assistants';
import { AssistantName } from '../../enums/enums';
import { AssistantsAbstractService } from '../assistants.abstract.service';
import { Gpt_Models } from 'src/modules/openai/enums/enums';
import { ImageNotTextException } from 'src/shared/exceptions/image-not-text.exception';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ThreadCreateParams } from 'openai/resources/beta/threads/threads';
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages';

/**
 * This service is responsible for the 'Summarizer' assistant.
 * The 'Summarizer' assistant is responsible for summarizing the story.
 */
@Injectable()
export class AssistantsSummarizerService extends AssistantsAbstractService {
  private assistant: Assistant;

  getAssistant(): Assistant {
    if (this.assistant) {
      return this.assistant;
    } else {
      throw new HttpException(
        'Assistant not initialized',
        HttpStatus.FAILED_DEPENDENCY,
      );
    }
  }

  async initializeAssistant(): Promise<void> {
    const assistant: Assistant | undefined =
      await this.checkIfAssistantAlreadyExists(AssistantName.SUMMARIZER);
    if (assistant) {
      await this.openaiAssistantsService.deleteAssistant(assistant.id);
    }

    const instructions = await this.loadInstructions(
      __dirname,
      'v1/instructions.txt',
      AssistantName.SUMMARIZER,
    );

    const description = await this.loadDescription(
      __dirname,
      'description.txt',
      AssistantName.SUMMARIZER,
    );

    this.assistant = await this.openaiAssistantsService.createAssistant({
      name: AssistantName.SUMMARIZER,
      description,
      instructions,
      model: Gpt_Models.GPT_4_TURBO_1106_PREVIEW,
    });
  }

  /**
   * This method is responsible for summarizing the entire story
   * @param threadId - The thread id that is used to identify the conversation between the refugee and the 'questioner'.
   * @returns - The summary of the story.
   */
  async createSummary(threadId: string): Promise<string> {
    const threadMessagesOfEntireConvo: ThreadMessage[] =
      await this.openaiMessagesService.listMessages(threadId);

    const transformedMessages: ThreadCreateParams.Message[] =
      await this.helpersService.convertThreadMessagesToMessageArray(
        threadMessagesOfEntireConvo,
      );

    const thread = await this.openaiThreadsService.createThread({
      messages: transformedMessages,
    });

    const run = await this.openaiRunsService.createRun(
      thread.id,
      this.assistant.id,
    );

    await this.openaiRunsService.retrieveRun(thread.id, run.id);

    const messages: ThreadMessage[] =
      await this.openaiMessagesService.listMessages(thread.id);

    if ('text' in messages[0].content[0]) {
      return messages[0].content[0].text.value;
    } else {
      throw new ImageNotTextException();
    }
  }
}
