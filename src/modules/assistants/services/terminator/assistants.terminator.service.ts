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
import {
  Thread,
  ThreadCreateParams,
} from 'openai/resources/beta/threads/threads';
import { HelpersService } from 'src/modules/helpers/services/helpers.service';
import { ConfigService } from '@nestjs/config';
import { Run } from 'openai/resources/beta/threads/runs/runs';

@Injectable()
export class AssistantsTerminatorService extends AssistantsAbstractService {
  private assistant: Assistant;

  constructor(
    private readonly helpersService: HelpersService,
    private readonly openaiMessagesService: OpenaiMessagesService,
    private readonly openaiRunsService: OpenaiRunsService,
    private readonly openaiThreadsService: OpenaiThreadsService,
    configService: ConfigService,
  ) {
    super(configService);
  }

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

    const run: Run = await this.openaiRunsService.runThread(
      thread.id,
      this.assistant.id,
    );

    await this.openaiRunsService.retrieveRun(thread.id, run.id);

    const terminatorThreadMessages: ThreadMessage[] =
      await this.openaiMessagesService.listMessages(thread.id);

    if ('text' in terminatorThreadMessages[0].content[0]) {
      const terminatorResponseText: string =
        terminatorThreadMessages[0].content[0].text.value;

      const isStoryGoodEnough = this.helpersService.parseLastResponseForJson(
        terminatorResponseText,
      );

      if (isStoryGoodEnough) {
        return true;
      } else {
        return false;
      }
    }
  }
}
