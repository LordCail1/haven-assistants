import { Assistant } from '../../openai/types/types';
import { AssistantName } from '../../openai/services/enums/enums';
import { Injectable } from '@nestjs/common';
import { OpenaiService } from '../../openai/services/openai.service';

@Injectable()
export class AssistantsTerminatorService {
  private assistant: Assistant;
  constructor(private readonly openaiService: OpenaiService) {}

  async createAssistant() {
    await this.checkIfAssistantAlreadyExists();

    // try {
    //   this.assistant = await this.openaiService
    //     .getOpenaiInstance()
    //     .beta.assistants.create({
    //       name: AssistantName.TERMINATOR,
    //       description:
    //         'analyze the conversation and judge if it is necessary to continue asking questions or terminate it',
    //       model: Gpt_Models.GPT_4_TURBO_1106_PREVIEW,
    //     });
    // } catch (error) {
    //   console.log(
    //     'something went wrong creating the questioner assistant',
    //     error,
    //   );
    // }
  }

  private async checkIfAssistantAlreadyExists() {
    const assistants = await this.openaiService
      .getOpenaiInstance()
      .beta.assistants.list();

    const foundAssistant = assistants.data.find(
      (assistant) => assistant.name === AssistantName.TERMINATOR,
    );
  }
}
