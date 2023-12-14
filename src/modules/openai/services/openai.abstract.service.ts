import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { openai_key } from 'src/shared/constants';
import OpenAI from 'openai';
/**
 * This service is an abstract service that all OpenAI services should extend
 */
@Injectable()
export class OpenaiAbstractService {
  /**
   * The OpenAI client instance
   */
  protected openai: OpenAI = new OpenAI({
    apiKey: this.configService.get<string>(openai_key),
  });

  /**
   *
   * @param configService The injected config service. (allows us to access the .env variables)
   */
  constructor(private readonly configService: ConfigService) {}
}
