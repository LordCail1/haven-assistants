import { Assistant } from 'openai/resources/beta/assistants/assistants';
import { AssistantName } from '../../enums/enums';
import { AssistantsAbstractService } from '../assistants.abstract.service';
import { Gpt_Models } from 'src/modules/openai/enums/enums';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

/**
 * This service is responsible for the 'Questioner' assistant.
 * The 'Questioner' assistant is responsible for asking the questions to the refugees signing up.
 */
@Injectable()
export class AssistantsQuestionerService extends AssistantsAbstractService {
  private assistant: Assistant;

  getAssistant(): Assistant {
    if (this.assistant) {
      return this.assistant;
    } else {
      throw new HttpException(
        'Assistant not initialized',
        HttpStatus.FAILED_DEPENDENCY,
      );
    }
  }

  async initializeAssistant(): Promise<void> {
    const assistant: Assistant | undefined =
      await this.checkIfAssistantAlreadyExists(AssistantName.QUESTIONER);
    if (assistant) {
      await this.openaiAssistantsService.deleteAssistant(assistant.id);
    }

    const instructions = await this.loadInstructions(
      __dirname,
      'v1/instructions.txt',
      AssistantName.QUESTIONER,
    );

    const description = await this.loadDescription(
      __dirname,
      'description.txt',
      AssistantName.QUESTIONER,
    );

    this.assistant = await this.openaiAssistantsService.createAssistant({
      name: AssistantName.QUESTIONER,
      description,
      instructions,
      model: Gpt_Models.GPT_4_TURBO_1106_PREVIEW,
    });
  }
}
