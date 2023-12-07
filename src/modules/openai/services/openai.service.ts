import { ConfigService } from '@nestjs/config';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { openai_key } from 'src/shared/constants';
import OpenAI from 'openai';
import { OpenaiThreadsService } from './api/openai.threads.service';
import { Thread } from '../types/types';
import { OpenaiMessagesService } from './api/openai.messages.service';
import { UserMessage } from 'src/shared/interfaces/interfaces';
import { OpenaiQuestionerService } from './assistants/openai.questioner.service';

@Injectable()
export class OpenaiService {
  private openai: OpenAI = new OpenAI({
    apiKey: this.configService.get<string>(openai_key),
  });

  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => OpenaiThreadsService))
    private readonly openaiThreadsService: OpenaiThreadsService,
    private readonly openaiMessagesService: OpenaiMessagesService,
    private readonly openaiQuestionerService: OpenaiQuestionerService,
  ) {}

  async createConversation(): Promise<Thread> {
    return this.openaiThreadsService.createThread();
  }

  async createFirstMessage(threadId: string, userMessage: UserMessage) {
    return this.openaiMessagesService.createMessage(threadId, userMessage);
  }

  async runThead(threadId: string) {
    return this.openaiThreadsService.runThread(
      threadId,
      this.openaiQuestionerService.getAssistantInstance().id,
    );
  }

  getOpenaiInstance() {
    return this.openai;
  }
}
