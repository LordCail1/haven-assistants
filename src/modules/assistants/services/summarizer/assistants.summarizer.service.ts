import { Assistant } from 'openai/resources/beta/assistants/assistants';
import { AssistantName } from '../../enums/enums';
import { AssistantsAbstractService } from '../assistants.abstract.service';
import { GettingAssistantException } from '../../exceptions/geting-assistant.exception';
import { Gpt_Models } from 'src/modules/openai/enums/enums';
import { ImageNotTextException } from 'src/shared/exceptions/image-not-text.exception';
import { HttpException, Injectable } from '@nestjs/common';
import { ThreadCreateParams } from 'openai/resources/beta/threads/threads';
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages';
import { InitializingAssistantException } from '../../exceptions/initializing-assistant.exception';
import { CreateSummaryException } from '../../exceptions/summarizer/create-summary.exception';

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
      throw new GettingAssistantException(AssistantName.SUMMARIZER);
    }
  }

  async initializeAssistant(): Promise<void> {
    try {
      const assistant: Assistant | undefined =
        await this.checkIfAssistantAlreadyExists(AssistantName.SUMMARIZER);
      if (assistant) {
        await this.openaiAssistantsService.deleteAssistant(assistant.id);
      }

      const instructions = await this.loadInstructions(
        __dirname,
        'v3/instructions.txt',
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
        model: Gpt_Models.GPT_VERSION,
      });
    } catch (error) {
      throw new InitializingAssistantException(AssistantName.SUMMARIZER, error);
    }
  }

  /**
   * This method is responsible for summarizing the entire story
   * @param threadId The thread id that is used to identify the conversation between the refugee and the 'questioner'.
   * @returns The summary of the story.
   */
  async createSummary(threadId: string): Promise<string> {
    try {
      const threadMessagesOfEntireConvo: ThreadMessage[] =
        await this.openaiMessagesService.listMessages(threadId);

      const transformedMessages: ThreadCreateParams.Message[] =
        this.helpersService.convertThreadMessagesToMessageArray(
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new CreateSummaryException(error);
      }
    }
  }
}
