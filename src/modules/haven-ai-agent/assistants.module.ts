import { AssistantsController } from './controllers/haven-ai-agent.controller';
import { HavenAiAgentService } from './services/haven-ai-agent.service';
import { Module } from '@nestjs/common';
import { OpenaiModule } from '../openai/openai.module';

@Module({
  imports: [OpenaiModule],
  controllers: [AssistantsController],
  providers: [HavenAiAgentService],
})
export class AssistantsModule {}
