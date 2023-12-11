import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { openai_key } from 'src/shared/constants';
import OpenAI from 'openai';
import { Assistant } from 'openai/resources/beta/assistants/assistants';
import { OpenaiAssistantsService } from 'src/modules/openai/services/openai.assistants.service';
import { OpenaiMessagesService } from 'src/modules/openai/services/openai.messages.service';
import { OpenaiThreadsService } from 'src/modules/openai/services/openai.threads.service';
import { OpenaiRunsService } from 'src/modules/openai/services/openai.runs.service';
import { HelpersService } from 'src/modules/helpers/services/helpers.service';
import { AssistantName } from '../enums/enums';

@Injectable()
export abstract class AssistantsAbstractService {
  protected openai: OpenAI = new OpenAI({
    apiKey: this.configService.get<string>(openai_key),
  });

  constructor(
    private readonly configService: ConfigService,
    protected readonly openaiAssistantsService: OpenaiAssistantsService,
    protected readonly openaiMessagesService: OpenaiMessagesService,
    protected readonly openaiThreadsService: OpenaiThreadsService,
    protected readonly openaiRunsService: OpenaiRunsService,
    protected readonly helpersService: HelpersService,
  ) {}

  abstract getAssistant(): Assistant;
  abstract createAssistant(): Promise<void>;
  protected async checkIfAssistantAlreadyExists(
    assistantName: AssistantName,
  ): Promise<Assistant | undefined> {
    const { data: assistants } =
      await this.openaiAssistantsService.listAllAssistants();

    return assistants.find((assistant) => assistant.name === assistantName);
  }
  protected abstract loadInstructions(): Promise<string>;
  protected abstract loadDescription(): Promise<string>;
}
