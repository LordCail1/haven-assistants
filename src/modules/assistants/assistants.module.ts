import { AssistantsController } from './controllers/assistants.controller';
import { AssistantsService } from './services/assistants.service';
import { Module } from '@nestjs/common';
import { OpenaiModule } from '../openai/openai.module';

@Module({
  imports: [OpenaiModule],
  controllers: [AssistantsController],
  providers: [AssistantsService],
})
export class AssistantsModule {}
