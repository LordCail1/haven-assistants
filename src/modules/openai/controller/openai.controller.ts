import { Body, Controller, Post } from '@nestjs/common';
import { OpenaiService } from '../services/openai.service';
import OpenAI from 'openai';
import { CreateAssistantDto } from '../dto/openai.dto';
import { IOpenaiController } from '../interfaces/interfaces';

@Controller('openai')
export class OpenaiController implements IOpenaiController {
  constructor(private openaiService: OpenaiService) {}
  @Post('create-assistant')
  createAssistant(
    @Body() createAssistantDto: CreateAssistantDto,
  ): Promise<OpenAI.Beta.Assistants.Assistant> {
    return this.openaiService.createAssistant(createAssistantDto);
  }

  @Post('create-thread')
  createThread() {
    return this.openaiService.createThread();
  }
}
