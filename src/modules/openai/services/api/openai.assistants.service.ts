import { Injectable } from '@nestjs/common';
import { OpenaiService } from '../openai.service';

@Injectable()
export class OpenaiAssistantsService {
  constructor(private readonly openaiService: OpenaiService) {}
}
