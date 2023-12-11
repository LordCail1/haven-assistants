import { Assistant } from 'openai/resources/beta/assistants/assistants';
import { AssistantName } from '../../enums/enums';
import { AssistantsAbstractService } from '../assistants.abstract.service';
import { Gpt_Models } from 'src/modules/openai/enums/enums';
import { ImageNotTextException } from 'src/shared/exceptions/image-not-text.exception';
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { promises as fs } from 'fs';
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
    return this.assistant;
  }

  async createAssistant(): Promise<void> {
    const assistant: Assistant | undefined =
      await this.checkIfAssistantAlreadyExists(AssistantName.SUMMARIZER);
    if (assistant) {
      this.assistant = assistant;
    } else {
      const instructions = await this.loadInstructions();
      const description = await this.loadDescription();
      this.assistant = await this.openaiAssistantsService.createAssistant({
        name: AssistantName.SUMMARIZER,
        description,
        instructions,
        model: Gpt_Models.GPT_4_TURBO_1106_PREVIEW,
      });
    }
  }

  protected async loadInstructions(): Promise<string> {
    try {
      const filePath = join(__dirname, 'v1/instructions.txt');
      return fs.readFile(filePath, 'utf-8');
    } catch (error) {
      console.log('something went wrong loading the instructions', error);
    }
  }

  protected async loadDescription(): Promise<string> {
    try {
      const filePath = join(__dirname, 'description.txt');
      return fs.readFile(filePath, 'utf-8');
    } catch (error) {
      console.log('something went wrong loading the description', error);
    }
  }

  async createSummary(threadId: string) {
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
