import { AssistantsAbstractService } from '../assistants.abstract.service';
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { promises as fs } from 'fs';
import { Gpt_Models } from 'src/modules/openai/enums/enums';
import { AssistantName } from '../../enums/enums';
import { Assistant } from 'openai/resources/beta/assistants/assistants';

@Injectable()
export class AssistantsSummarizerService extends AssistantsAbstractService {
  private assistant: Assistant;

  getAssistant(): Assistant {
    return this.assistant;
  }

  async createAssistant(): Promise<void> {
    const assistant: Assistant | undefined =
      await this.checkIfAssistantAlreadyExists();
    if (assistant) {
      this.assistant = assistant;
    } else {
      const instructions = await this.loadInstructions();
      const description = await this.loadDescription();
      try {
        this.assistant = await this.openai.beta.assistants.create({
          name: AssistantName.SUMMARIZER,
          description,
          instructions,
          model: Gpt_Models.GPT_4_TURBO_1106_PREVIEW,
        });
      } catch (error) {
        console.log(
          `something went wrong creating the ${AssistantName.SUMMARIZER} assistant`,
          error,
        );
      }
    }
  }

  protected async checkIfAssistantAlreadyExists(): Promise<
    Assistant | undefined
  > {
    const { data: assistants } = await this.openai.beta.assistants.list();

    return assistants.find(
      (assistant) => assistant.name === AssistantName.SUMMARIZER,
    );
  }

  protected async loadInstructions(): Promise<string> {
    try {
      const filePath = join(__dirname, 'instructions.txt');
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
