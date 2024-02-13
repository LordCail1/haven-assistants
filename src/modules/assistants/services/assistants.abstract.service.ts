import { Assistant } from 'openai/resources/beta/assistants/assistants';
import { AssistantName } from '../enums/enums';
import { HelpersService } from 'src/modules/helpers/services/helpers.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { join } from 'path';
import { OpenaiAssistantsService } from 'src/modules/openai/services/assistants/openai.assistants.service';
import { OpenaiMessagesService } from 'src/modules/openai/services/messages/openai.messages.service';
import { OpenaiRunsService } from 'src/modules/openai/services/runs/openai.runs.service';
import { OpenaiThreadsService } from 'src/modules/openai/services/threads/openai.threads.service';
import { promises as fs } from 'fs';
import OpenAI from 'openai';
import { MyLogger } from 'src/modules/logger/services/logger.service';
/**
 * This is an abstract service that all the assistants will extend.
 * It contains all the common functionality that all the assistants will use.
 */
@Injectable()
export abstract class AssistantsAbstractService {
  constructor(
    protected openai: OpenAI,
    protected readonly helpersService: HelpersService,
    protected readonly openaiAssistantsService: OpenaiAssistantsService,
    protected readonly openaiMessagesService: OpenaiMessagesService,
    protected readonly openaiRunsService: OpenaiRunsService,
    protected readonly openaiThreadsService: OpenaiThreadsService,
    protected readonly myLogger: MyLogger,
  ) {}

  /**
   * This method is responsible for getting the assistant
   * @returns The assistant
   */
  abstract getAssistant(): Assistant;

  /**
   * This method will syncronize the assistants in the repository with the assistants in OpenAI.
   */
  abstract initializeAssistant(): Promise<void>;

  /**
   * This method will check if the assistant already exists.
   * @param assistantName The name of the assistant.
   * @returns The assistant if it exists
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
   * @param dirname The value of __dirname where the assistant is located.
   * @param fileLocation The location of the instructions file relative to the assistant's service.
   * @param assistantName The name of the assistant.
   * @returns The instructions as a string.
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
        `Something went wrong loading the instructions for the ${assistantName} assistant`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  /**
   * This method is responsible for loading the description into the assistant.
   * @param dirname The value of __dirname where the assistant is located.
   * @param fileLocation The location of the description file relative to the assistant's service.
   * @param assistantName The name of the assistant.
   * @returns The description as a string.
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
        `Something went wrong loading the description for the ${assistantName} assistant`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }
}
