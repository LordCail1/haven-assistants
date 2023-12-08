import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { OpenaiService } from '../openai.service';
import { UserMessage } from 'src/shared/interfaces/interfaces';

@Injectable()
export class OpenaiMessagesService {
  constructor(
    @Inject(forwardRef(() => OpenaiService))
    private readonly openaiService: OpenaiService,
  ) {}

  createMessage(threadId: string, userMessage: UserMessage) {
    return this.openaiService
      .getOpenaiInstance()
      .beta.threads.messages.create(threadId, userMessage);
  }
}
