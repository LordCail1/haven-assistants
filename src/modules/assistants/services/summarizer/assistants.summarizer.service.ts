import { AssistantsAbstractService } from '../assistants.abstract.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { join } from 'path';
import { promises as fs } from 'fs';
import { Gpt_Models } from 'src/modules/openai/enums/enums';
import { AssistantName } from '../../enums/enums';
import { Assistant } from 'openai/resources/beta/assistants/assistants';
import { ConfigService } from '@nestjs/config';
import { OpenaiMessagesService } from 'src/modules/openai/services/openai.messages.service';
import { OpenaiRunsService } from 'src/modules/openai/services/openai.runs.service';
import { OpenaiThreadsService } from 'src/modules/openai/services/openai.threads.service';
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages';
import { ThreadCreateParams } from 'openai/resources/beta/threads/threads';
import { HelpersService } from 'src/modules/helpers/services/helpers.service';

@Injectable()
export class AssistantsSummarizerService extends AssistantsAbstractService {
  private assistant: Assistant;

  constructor(
    configService: ConfigService,
    private readonly openaiMessagesService: OpenaiMessagesService,
    private readonly openaiRunsService: OpenaiRunsService,
    private readonly openaiThreadsService: OpenaiThreadsService,
    private readonly helpersService: HelpersService,
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
          name: AssistantName.SUMMARIZER,
          description,
          instructions,
          model: Gpt_Models.GPT_4_TURBO_1106_PREVIEW,
        });
      } catch (error) {
        console.log(
          `something went wrong creating the ${AssistantName.SUMMARIZER} assistant`,
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
      (assistant) => assistant.name === AssistantName.SUMMARIZER,
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

    const run = await this.openaiRunsService.runThread(
      thread.id,
      this.assistant.id,
    );

    await this.openaiRunsService.retrieveRun(thread.id, run.id);

    const messages: ThreadMessage[] =
      await this.openaiMessagesService.listMessages(thread.id);

    if ('text' in messages[0].content[0]) {
      return messages[0].content[0].text.value;
    } else {
      throw new HttpException(
        'Message content does not have the right format',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
