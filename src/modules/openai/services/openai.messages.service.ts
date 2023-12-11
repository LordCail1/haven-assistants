import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { openai_key } from 'src/shared/constants';
import { UserMessage } from 'src/shared/interfaces/interfaces';
import OpenAI from 'openai';
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages';

/**
 * This service is responsible for interacting with the OpenAI messages API
 * https://platform.openai.com/docs/api-reference/messages
 */
@Injectable()
export class OpenaiMessagesService {
  private openai: OpenAI = new OpenAI({
    apiKey: this.configService.get<string>(openai_key),
  });

  constructor(private readonly configService: ConfigService) {}

  async createMessage(
    threadId: string,
    userMessage: UserMessage,
  ): Promise<ThreadMessage> {
    return this.openai.beta.threads.messages.create(threadId, userMessage);
  }

  async listMessages(threadId: string) {
    const { data } = await this.openai.beta.threads.messages.list(threadId);
    return data;
  }
}
