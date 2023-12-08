import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { openai_key } from 'src/shared/constants';
import { UserMessage } from 'src/shared/interfaces/interfaces';
import OpenAI from 'openai';
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages';

@Injectable()
export class OpenaiMessagesService {
  private openai: OpenAI = new OpenAI({
    apiKey: this.configService.get<string>(openai_key),
  });

  constructor(private readonly configService: ConfigService) {}

  createMessage(
    threadId: string,
    userMessage: UserMessage,
  ): Promise<ThreadMessage> {
    return this.openai.beta.threads.messages.create(threadId, userMessage);
  }

  listMessages(threadId: string) {
    return this.openai.beta.threads.messages.list(threadId);
  }
}
