import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { openai_key, organization_id } from 'src/shared/constants';
import { HelpersModule } from '../helpers/helpers.module';
import { OpenaiModule } from '../openai/openai.module';
import { AssistantsQuestionerService } from './services/questioner/assistants.questioner.service';
import { AssistantsRefugeeService } from './services/refugee/assistants.refugee.service';
import { AssistantsSummarizerService } from './services/summarizer/assistants.summarizer.service';
import { AssistantsTerminatorService } from './services/terminator/assistants.terminator.service';
import { Module } from '@nestjs/common';
/**
 * This module is responsible for managing the assistants that are created in OpenAI.
 */
@Module({
  imports: [HelpersModule, OpenaiModule],
  providers: [
    AssistantsQuestionerService,
    AssistantsTerminatorService,
    AssistantsSummarizerService,
    AssistantsRefugeeService,
    {
      provide: OpenAI,
      useFactory: (configService: ConfigService) => {
        return new OpenAI({
          apiKey: configService.get<string>(openai_key),
          organization:
            process.env.NODE_ENV === 'production'
              ? configService.get<string>(organization_id)
              : undefined,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [
    AssistantsQuestionerService,
    AssistantsTerminatorService,
    AssistantsSummarizerService,
    AssistantsRefugeeService,
  ],
})
export class AssistantsModule {
  constructor(
    private readonly assistantsQuestionerService: AssistantsQuestionerService,
    private readonly assistantsTerminatorService: AssistantsTerminatorService,
    private readonly assistantsSummarizerService: AssistantsSummarizerService,
    private readonly assistantsRefugeeService: AssistantsRefugeeService,
  ) {}
  async onModuleInit() {
    await this.assistantsQuestionerService.initializeAssistant();
    console.log('Questioner assistant initialized');
    await this.assistantsTerminatorService.initializeAssistant();
    console.log('Terminator assistant initialized');
    await this.assistantsSummarizerService.initializeAssistant();
    console.log('Summarizer assistant initialized');
    await this.assistantsRefugeeService.initializeAssistant();
    console.log('Refugee assistant initialized');
  }
}
