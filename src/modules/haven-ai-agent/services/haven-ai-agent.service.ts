import { GenerateFirstQuestionDto } from '../dto/generate-first-question.dto';
import { GenerateFollowUpQuestionDto } from '../dto/generate-followup-question.dto';
import { PromptCreatorService } from 'src/modules/prompt-creator/services/prompt-creator.service';
import { UserMessage } from 'src/shared/interfaces/interfaces';
import { AssistantsQuestionerService } from 'src/modules/assistants/services/questioner/assistants.questioner.service';
import { Injectable } from '@nestjs/common';
import { OpenaiMessagesService } from 'src/modules/openai/services/openai.messages.service';
import { OpenaiRunsService } from 'src/modules/openai/services/openai.runs.service';
import { OpenaiThreadsService } from 'src/modules/openai/services/openai.threads.service';
import { Assistant } from 'openai/resources/beta/assistants/assistants';
import { Thread } from 'openai/resources/beta/threads/threads';
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages';

@Injectable()
export class HavenAiAgentService {
  constructor(
    private readonly promptCreatorService: PromptCreatorService,
    private readonly openaiThreadsService: OpenaiThreadsService,
    private readonly openaiMessagesService: OpenaiMessagesService,
    private readonly openaiRunsService: OpenaiRunsService,
    private readonly assistantsQuestionerService: AssistantsQuestionerService,
  ) {}

  async generateFirstQuestion(
    generateFirstQuestionDto: GenerateFirstQuestionDto,
  ): Promise<ThreadMessage[]> {
    const questionerAssistant: Assistant =
      this.assistantsQuestionerService.getAssistant();

    const thread: Thread = await this.openaiThreadsService.createThread();

    const firstPrompt: UserMessage =
      this.promptCreatorService.createFirstPrompt(generateFirstQuestionDto);

    await this.openaiMessagesService.createMessage(thread.id, firstPrompt);

    const run = await this.openaiRunsService.runThread(
      thread.id,
      questionerAssistant.id,
    );

    await this.openaiRunsService.retrieveRun(thread.id, run.id);

    const { data } = await this.openaiMessagesService.listMessages(thread.id);
    return data;
  }

  async generateFollowUpQuestion(
    generateFollowUpQuestionDto: GenerateFollowUpQuestionDto,
  ) {
    return 'success';
  }

  async getAllMessages() {
    return this.openaiMessagesService.listMessages('fjf');
  }
}
