import { Assistant } from 'openai/resources/beta/assistants/assistants';
import { AssistantName } from '../../enums/enums';
import { AssistantsAbstractService } from '../assistants.abstract.service';
import { Gpt_Models } from 'src/modules/openai/enums/enums';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AssistantsRefugeeService extends AssistantsAbstractService {
  private assistant: Assistant;

  getAssistant(): Assistant {
    return this.assistant;
  }

  async createAssistant(): Promise<void> {
    const assistant: Assistant | undefined =
      await this.checkIfAssistantAlreadyExists(AssistantName.REFUGEE);
    if (assistant) {
      this.assistant = assistant;
    } else {
      const instructions = await this.loadInstructions(
        __dirname,
        'v1/instructions.txt',
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
    }
  }
}
