import { HavenAiAgentController } from './controllers/haven-ai-agent.controller';
import { HavenAiAgentService } from './services/haven-ai-agent.service';
import { Module } from '@nestjs/common';
import { OpenaiModule } from '../openai/openai.module';
import { PromptCreatorModule } from '../prompt-creator/prompt-creator.module';

@Module({
  imports: [OpenaiModule, PromptCreatorModule],
  controllers: [HavenAiAgentController],
  providers: [HavenAiAgentService],
})
export class HavenAiAgentModule {}
