import { Module } from '@nestjs/common';
import { OpenaiController } from './controller/openai.controller';
import { OpenaiService } from './services/openai.service';

@Module({
  controllers: [OpenaiController],
  providers: [OpenaiService],
})
export class OpenaiModule {}
