import { Injectable } from '@nestjs/common';
import { OpenaiService } from '../openai.service';

@Injectable()
export class OpenaiRunsService {
  constructor(private readonly openaiService: OpenaiService) {}
}
