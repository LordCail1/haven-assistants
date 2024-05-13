import { Assistant } from 'openai/resources/beta/assistants/assistants';
import { AssistantName } from '../../enums/enums';
import { AssistantsAbstractService } from '../assistants.abstract.service';
import { GettingAssistantException } from '../../exceptions/geting-assistant.exception';
import { Gpt_Models } from 'src/modules/openai/enums/enums';
import { Injectable } from '@nestjs/common';
import { InitializingAssistantException } from '../../exceptions/initializing-assistant.exception';

/**
 * This service is responsible for the 'Questioner' assistant.
 * The 'Questioner' assistant is responsible for asking the questions to the refugees signing up.
 */
@Injectable()
export class AssistantsCriteriaParserService extends AssistantsAbstractService {
  private assistant: Assistant;

  getAssistant(): Assistant {
    if (this.assistant) {
      return this.assistant;
    } else {
      throw new GettingAssistantException(AssistantName.CRITERIA_PARSER);
    }
  }

  async initializeAssistant(): Promise<void> {
    try {
      const assistant: Assistant | undefined =
        await this.checkIfAssistantAlreadyExists(AssistantName.CRITERIA_PARSER);

      if (assistant) {
        await this.openaiAssistantsService.deleteAssistant(assistant.id);
      }

      const instructions = await this.loadInstructions(
        __dirname,
        'v1/instructions.txt',
        AssistantName.CRITERIA_PARSER,
      );

      const description = await this.loadDescription(
        __dirname,
        'description.txt',
        AssistantName.CRITERIA_PARSER,
      );

      this.assistant = await this.openaiAssistantsService.createAssistant({
        name: AssistantName.CRITERIA_PARSER,
        description,
        instructions,
        model: Gpt_Models.GPT_VERSION,
      });
    } catch (error) {
      throw new InitializingAssistantException(
        AssistantName.CRITERIA_PARSER,
        error,
      );
    }
  }
}
