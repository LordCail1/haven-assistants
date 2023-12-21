import { Assistant } from 'openai/resources/beta/assistants/assistants';
import { AssistantName } from '../../enums/enums';
import { AssistantsAbstractService } from '../assistants.abstract.service';
import { GettingAssistantException } from '../../exceptions/geting-assistant.exception';
import { Gpt_Models } from 'src/modules/openai/enums/enums';
import { InitializingAssistantException } from '../../exceptions/initializing-assistant.exception';
import { Injectable } from '@nestjs/common';

/**
 * This service is responsible for the 'Refugee' assistant.
 * The 'Refugee' assistant exists simply for the sake of testing the 'Questioner' assistant.
 * It simulates a refugee.
 */
@Injectable()
export class AssistantsRefugeeService extends AssistantsAbstractService {
  private assistant: Assistant;

  getAssistant(): Assistant {
    if (this.assistant) {
      return this.assistant;
    } else {
      throw new GettingAssistantException(AssistantName.REFUGEE);
    }
  }

  async initializeAssistant(): Promise<void> {
    try {
      const assistant: Assistant | undefined =
        await this.checkIfAssistantAlreadyExists(AssistantName.REFUGEE);
      if (assistant) {
        await this.openaiAssistantsService.deleteAssistant(assistant.id);
      }

      const instructions = await this.loadInstructions(
        __dirname,
        'ukrain/Olena/v1/instructions.txt',
        AssistantName.REFUGEE,
      );

      const description = await this.loadDescription(
        __dirname,
        'description.txt',
        AssistantName.REFUGEE,
      );

      this.assistant = await this.openaiAssistantsService.createAssistant({
        name: AssistantName.REFUGEE,
        description,
        instructions,
        model: Gpt_Models.GPT_4_TURBO_1106_PREVIEW,
      });
    } catch (error) {
      throw new InitializingAssistantException(AssistantName.REFUGEE, error);
    }
  }
}
