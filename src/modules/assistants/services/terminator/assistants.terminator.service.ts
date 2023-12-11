import { Injectable } from '@nestjs/common';
import { AssistantsAbstractService } from '../assistants.abstract.service';
import { join } from 'path';
import { promises as fs } from 'fs';
import { Gpt_Models } from 'src/modules/openai/enums/enums';
import { AssistantName } from '../../enums/enums';
import { Assistant } from 'openai/resources/beta/assistants/assistants';
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages';
import {
  Thread,
  ThreadCreateParams,
} from 'openai/resources/beta/threads/threads';
import { Run } from 'openai/resources/beta/threads/runs/runs';
import { ImageNotTextException } from 'src/shared/exceptions/image-not-text.exception';

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

  async createAssistant(): Promise<void> {
    const assistant: Assistant | undefined =
      await this.checkIfAssistantAlreadyExists(AssistantName.TERMINATOR);
    if (assistant) {
      this.assistant = assistant;
    } else {
      const instructions = await this.loadInstructions();
      const description = await this.loadDescription();
      this.assistant = await this.openaiAssistantsService.createAssistant({
        name: AssistantName.TERMINATOR,
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

  async determineIfStoryIsGoodEnough(threadId: string): Promise<boolean> {
    const threadMessages: ThreadMessage[] =
      await this.openaiMessagesService.listMessages(threadId);

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
