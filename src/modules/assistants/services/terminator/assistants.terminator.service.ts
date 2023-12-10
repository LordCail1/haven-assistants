import { Injectable } from '@nestjs/common';
import { AssistantsAbstractService } from '../assistants.abstract.service';
import { join } from 'path';
import { promises as fs } from 'fs';
import { Gpt_Models } from 'src/modules/openai/enums/enums';
import { AssistantName } from '../../enums/enums';
import { Assistant } from 'openai/resources/beta/assistants/assistants';
import { OpenaiThreadsService } from 'src/modules/openai/services/openai.threads.service';
import { OpenaiMessagesService } from 'src/modules/openai/services/openai.messages.service';
import { OpenaiRunsService } from 'src/modules/openai/services/openai.runs.service';
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages';
import { ThreadCreateParams } from 'openai/resources/beta/threads/threads';

@Injectable()
export class AssistantsTerminatorService extends AssistantsAbstractService {
  private assistant: Assistant;

  getAssistant(): Assistant {
    return this.assistant;
  }

  async createAssistant(): Promise<void> {
    const assistant: Assistant | undefined =
      await this.checkIfAssistantAlreadyExists();
    if (assistant) {
      this.assistant = assistant;
    } else {
      const instructions = await this.loadInstructions();
      const description = await this.loadDescription();
      try {
        this.assistant = await this.openai.beta.assistants.create({
          name: AssistantName.TERMINATOR,
          description,
          instructions,
          model: Gpt_Models.GPT_4_TURBO_1106_PREVIEW,
        });
      } catch (error) {
        console.log(
          `something went wrong creating the ${AssistantName.TERMINATOR} assistant`,
          error,
        );
      }
    }
  }

  protected async checkIfAssistantAlreadyExists(): Promise<
    Assistant | undefined
  > {
    const { data: assistants } = await this.openai.beta.assistants.list();

    return assistants.find(
      (assistant) => assistant.name === AssistantName.TERMINATOR,
    );
  }

  protected async loadInstructions(): Promise<string> {
    try {
      const filePath = join(__dirname, 'instructions.txt');
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

  async determineIfStoryIsGoodEnough(
    threadId: string,
    openaiMessagesService: OpenaiMessagesService,
    openaiThreadsService: OpenaiThreadsService,
    openaiRunsService: OpenaiRunsService,
  ): Promise<boolean> {
    const threadMessagesBeforeVerification: ThreadMessage[] =
      await openaiMessagesService.listMessages(threadId);

    const messages: ThreadCreateParams.Message[] =
      await this.convertThreadMessagesToMessageArray(
        threadMessagesBeforeVerification,
      );

    const terminatorThread = await openaiThreadsService.createThread({
      messages,
    });

    const run = await openaiRunsService.runThread(
      terminatorThread.id,
      this.assistant.id,
    );

    await openaiRunsService.retrieveRun(terminatorThread.id, run.id);

    const terminatorThreadMessages: ThreadMessage[] =
      await openaiMessagesService.listMessages(terminatorThread.id);

    if ('text' in terminatorThreadMessages[0].content[0]) {
      const terminatorResponseText: string =
        terminatorThreadMessages[0].content[0].text.value;

      const isStoryGoodEnough = this.parseLastResponseForJson(
        terminatorResponseText,
      );

      if (isStoryGoodEnough) {
        return true;
      } else return false;
    } else {
      throw new Error('Message content does not have the right format');
    }
  }

  parseLastResponseForJson(response: string): boolean {
    console.log(response);
    try {
      const parsedJson = JSON.parse(response);
      const isStoryGoodEnough = parsedJson.isStoryGoodEnough;
      if (typeof isStoryGoodEnough !== 'boolean') {
        throw new Error('isStoryGoodEnough is not a boolean');
      }
      return isStoryGoodEnough;
    } catch (error) {
      console.log('something went wrong parsinng the json!', error);
    }
  }

  /**
   * Converts the thread messages from one format to another
   * @param threadMessages the thread messages that are in the format 'ThreadMessage[]'
   * @returns an array of messages that is in the format 'Message[]'
   */
  async convertThreadMessagesToMessageArray(
    threadMessages: ThreadMessage[],
  ): Promise<ThreadCreateParams.Message[]> {
    return threadMessages.map((message: ThreadMessage) => {
      if ('text' in message.content[0]) {
        return {
          content: message.content[0].text.value,
          role: 'user',
        };
      } else {
        throw new Error('Message content contained files is not text');
      }
    });
  }
}
