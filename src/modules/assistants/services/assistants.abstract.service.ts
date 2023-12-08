import { Assistant } from 'src/modules/openai/types/types';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { openai_key } from 'src/shared/constants';
import OpenAI from 'openai';

@Injectable()
export abstract class AssistantsAbstractService {
  protected openai: OpenAI = new OpenAI({
    apiKey: this.configService.get<string>(openai_key),
  });

  constructor(private readonly configService: ConfigService) {}

  abstract getAssistant(): Assistant;
  abstract createAssistant(): Promise<void>;
  protected abstract checkIfAssistantAlreadyExists(): Promise<
    Assistant | undefined
  >;
  protected abstract loadInstructions(): Promise<string>;
  protected abstract loadDescription(): Promise<string>;
}
