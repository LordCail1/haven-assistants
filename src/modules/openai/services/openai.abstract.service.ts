import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { openai_key } from 'src/shared/constants';
import OpenAI from 'openai';
/**
 * This service is an abstract service that all OpenAI services should extend
 */
@Injectable()
export class OpenaiAbstractService {
  protected openai: OpenAI = new OpenAI({
    apiKey: this.configService.get<string>(openai_key),
  });

  constructor(private readonly configService: ConfigService) {}
}
