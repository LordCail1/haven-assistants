import { AssistantsModule } from '../assistants/assistants.module';
import { HavenAiAgentController } from './controllers/haven-ai-agent.controller';
import { HavenAiAgentService } from './services/haven-ai-agent.service';
import { Module } from '@nestjs/common';
import { OpenaiModule } from '../openai/openai.module';
import { PromptCreatorModule } from '../prompt-creator/prompt-creator.module';
import { LoggerModule } from '../logger/logger.module';

/**
 * This module is responsible for managing the entire behavior of the Haven AI Agent.
 */
@Module({
  imports: [OpenaiModule, PromptCreatorModule, AssistantsModule, LoggerModule],
  controllers: [HavenAiAgentController],
  providers: [HavenAiAgentService],
})
export class HavenAiAgentModule {}
