import { APIPromise } from 'openai/core';
import { Controller, Get } from '@nestjs/common';
import { OpenaiService } from '../services/openai.service';
import OpenAI from 'openai';

@Controller('openai')
export class OpenaiController {
  constructor(private openaiService: OpenaiService) {}
  @Get()
  createAssistant(): Promise<APIPromise<OpenAI.Beta.Assistants.Assistant>> {
    return this.openaiService.createAssistant();
  }
}
