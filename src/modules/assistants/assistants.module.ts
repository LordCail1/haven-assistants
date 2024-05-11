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
import { AssistantsCriteriaParserService } from './services/criteriaParser/assistants.criteriaParser.service';
import { MyLogger } from '../logger/services/logger.service';
import { LoggerModule } from '../logger/logger.module';
import { AssistantsLanguageSimplifierService } from './services/languageSimplifier/assistants.languageSimplifier.service';
/**
 * This module is responsible for managing the assistants that are created in OpenAI.
 */
@Module({
  imports: [HelpersModule, OpenaiModule, LoggerModule],
  providers: [
    AssistantsCriteriaParserService,
    AssistantsLanguageSimplifierService,
    AssistantsQuestionerService,
    AssistantsRefugeeService,
    AssistantsSummarizerService,
    AssistantsTerminatorService,
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
    AssistantsCriteriaParserService,
    AssistantsLanguageSimplifierService,
    AssistantsQuestionerService,
    AssistantsRefugeeService,
    AssistantsSummarizerService,
    AssistantsTerminatorService,
  ],
})
export class AssistantsModule {
  constructor(
    private readonly assistantsCriteriaParserService: AssistantsCriteriaParserService,
    private readonly assistantsLanguageSimplifierService: AssistantsLanguageSimplifierService,
    private readonly assistantsQuestionerService: AssistantsQuestionerService,
    private readonly assistantsRefugeeService: AssistantsRefugeeService,
    private readonly assistantsSummarizerService: AssistantsSummarizerService,
    private readonly assistantsTerminatorService: AssistantsTerminatorService,
    private readonly myLoger: MyLogger,
  ) {}
  async onModuleInit() {
    await this.assistantsCriteriaParserService.initializeAssistant();
    this.myLoger.log(`Criteria parser assistant initialized`);
    await this.assistantsQuestionerService.initializeAssistant();
    this.myLoger.log('Questioner assistant initialized');
    await this.assistantsRefugeeService.initializeAssistant();
    this.myLoger.log('Refugee assistant initialized');
    await this.assistantsSummarizerService.initializeAssistant();
    this.myLoger.log('Summarizer assistant initialized');
    await this.assistantsTerminatorService.initializeAssistant();
    this.myLoger.log('Terminator assistant initialized');
    await this.assistantsLanguageSimplifierService.initializeAssistant();
    this.myLoger.log('Language simplifier assistant initialized');
  }
}
