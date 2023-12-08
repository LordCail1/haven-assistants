import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { openai_key } from 'src/shared/constants';
import { OpenaiMessagesService } from './api/openai.messages.service';
import { OpenaiQuestionerService } from './assistants/openai.questioner.service';
import { OpenaiRunsService } from './api/openai.runs.service';
import { OpenaiThreadsService } from './api/openai.threads.service';
import { Thread } from '../types/types';
import { UserMessage } from 'src/shared/interfaces/interfaces';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService {
  private openai: OpenAI = new OpenAI({
    apiKey: this.configService.get<string>(openai_key),
  });

  constructor(
    private readonly configService: ConfigService,
    private readonly openaiThreadsService: OpenaiThreadsService,
    private readonly openaiMessagesService: OpenaiMessagesService,
    private readonly openaiQuestionerService: OpenaiQuestionerService,
    private readonly openaiRunsService: OpenaiRunsService,
  ) {}

  async createConversation(): Promise<Thread> {
    return this.openaiThreadsService.createThread();
  }

  async createFirstMessage(threadId: string, userMessage: UserMessage) {
    return this.openaiMessagesService.createMessage(threadId, userMessage);
  }

  async runThead(threadId: string) {
    return this.openaiRunsService.runThread(
      threadId,
      this.openaiQuestionerService.getAssistantInstance().id,
    );
  }

  getOpenaiInstance() {
    return this.openai;
  }
}
