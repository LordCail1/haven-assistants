import { Body, Controller, Post } from '@nestjs/common';
import { OpenaiService } from '../services/openai.service';
import OpenAI from 'openai';
import { CreateAssistantDto } from '../dto/openai.dto';

@Controller('openai')
export class OpenaiController {
  constructor(private openaiService: OpenaiService) {}
  @Post()
  createAssistant(
    @Body() createAssistantDto: CreateAssistantDto,
  ): Promise<OpenAI.Beta.Assistants.Assistant> {
    return this.openaiService.createAssistant(createAssistantDto);
  }
}
