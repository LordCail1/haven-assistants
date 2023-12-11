import { Injectable } from '@nestjs/common';
import { AssistantsAbstractService } from '../assistants.abstract.service';
import { join } from 'path';
import { promises as fs } from 'fs';
import { Gpt_Models } from 'src/modules/openai/enums/enums';
import { AssistantName } from '../../enums/enums';
import { Assistant } from 'openai/resources/beta/assistants/assistants';

/**
 * This service is responsible for the 'Questioner' assistant.
 * The 'Questioner' assistant is responsible for asking the questions to the refugees signing up.
 */
@Injectable()
export class AssistantsQuestionerService extends AssistantsAbstractService {
  private assistant: Assistant;

  getAssistant(): Assistant {
    return this.assistant;
  }

  async createAssistant(): Promise<void> {
    const assistant: Assistant | undefined =
      await this.checkIfAssistantAlreadyExists(AssistantName.QUESTIONER);
    if (assistant) {
      this.assistant = assistant;
    } else {
      const instructions = await this.loadInstructions();
      const description = await this.loadDescription();
      this.assistant = await this.openaiAssistantsService.createAssistant({
        name: AssistantName.QUESTIONER,
        description,
        instructions,
        model: Gpt_Models.GPT_4_TURBO_1106_PREVIEW,
      });
    }
  }

  protected async loadInstructions(): Promise<string> {
    try {
      const filePath = join(__dirname, 'v1/instructions.txt');
      return fs.readFile(filePath, 'utf-8');
    } catch (error) {
      console.log('something went wrong loading the instructions', error);
    }
  }

  protected async loadDescription(): Promise<string> {
    try {
      const filePath = join(__dirname, 'description.txt');
      return fs.readFile(filePath, 'utf-8');
    } catch (error) {
      console.log('something went wrong loading the description', error);
    }
  }
}
