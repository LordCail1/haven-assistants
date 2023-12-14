import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { openai_key } from 'src/shared/constants';
import OpenAI from 'openai';
import { Assistant } from 'openai/resources/beta/assistants/assistants';
import { HelpersService } from 'src/modules/helpers/services/helpers.service';
import { AssistantName } from '../enums/enums';
import { promises as fs } from 'fs';
import { join } from 'path';
import { OpenaiAssistantsService } from 'src/modules/openai/services/assistants/openai.assistants.service';
import { OpenaiMessagesService } from 'src/modules/openai/services/messages/openai.messages.service';
import { OpenaiRunsService } from 'src/modules/openai/services/runs/openai.runs.service';
import { OpenaiThreadsService } from 'src/modules/openai/services/threads/openai.threads.service';
/**
 * This is an abstract class/service that all the assistants will extend.
 * It contains all the common functionality that all the assistants will use.
 */
@Injectable()
export abstract class AssistantsAbstractService {
  protected openai: OpenAI = new OpenAI({
    apiKey: this.configService.get<string>(openai_key),
  });

  /**
   * @param configService - The injected config service. (allows us to access the .env variables)
   */
  constructor(
    private readonly configService: ConfigService,
    protected readonly openaiAssistantsService: OpenaiAssistantsService,
    protected readonly openaiMessagesService: OpenaiMessagesService,
    protected readonly openaiThreadsService: OpenaiThreadsService,
    protected readonly openaiRunsService: OpenaiRunsService,
    protected readonly helpersService: HelpersService,
  ) {}

  /**
   * This method will return the assistant that is being used.
   */
  abstract getAssistant(): Assistant;

  /**
   * This method will syncronize the assistants in the repository with the assistants in OpenAI.
   */
  abstract initializeAssistant(): Promise<void>;

  /**
   * This method will check if the assistant already exists.
   * @param assistantName - The name of the assistant.
   * @returns the assistant if it exists
   */
  protected async checkIfAssistantAlreadyExists(
    assistantName: AssistantName,
  ): Promise<Assistant | undefined> {
    const { data: assistants } =
      await this.openaiAssistantsService.listAllAssistants();

    return assistants.find((assistant) => assistant.name === assistantName);
  }

  /**
   * This method is responsible for loading the instructions into the assistant.
   * @param dirname - the value of __dirname where the assistant is located.
   * @param fileLocation - the location of the instructions file relative to the assistant's service.
   * @param assistantName - the name of the assistant.
   * @returns the instructions as a string.
   */
  protected async loadInstructions(
    dirname: string,
    fileLocation: string,
    assistantName: AssistantName,
  ): Promise<string> {
    try {
      const filePath = join(dirname, fileLocation);
      return fs.readFile(filePath, 'utf-8');
    } catch (error) {
      throw new HttpException(
        {
          message: `Something went wrong loading the instructions for the ${assistantName} assistant`,
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * This method is responsible for loading the description into the assistant.
   * @param dirname - the value of __dirname where the assistant is located.
   * @param fileLocation - the location of the description file relative to the assistant's service.
   * @param assistantName - the name of the assistant.
   * @returns the description as a string.
   */
  protected async loadDescription(
    dirname: string,
    fileLocation: string,
    assistantName: AssistantName,
  ): Promise<string> {
    try {
      const filePath = join(dirname, fileLocation);
      return fs.readFile(filePath, 'utf-8');
    } catch (error) {
      throw new HttpException(
        {
          message: `Something went wrong loading the description for the ${assistantName} assistant`,
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
