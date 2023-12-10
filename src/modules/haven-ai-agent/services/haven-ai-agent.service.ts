import { AssistantsQuestionerService } from 'src/modules/assistants/services/questioner/assistants.questioner.service';
import { AssistantsTerminatorService } from 'src/modules/assistants/services/terminator/assistants.terminator.service';
import { GenerateFirstQuestionDto } from '../dto/generate-first-question.dto';
import { GenerateFollowUpQuestionDto } from '../dto/generate-followup-question.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OpenaiMessagesService } from 'src/modules/openai/services/openai.messages.service';
import { OpenaiRunsService } from 'src/modules/openai/services/openai.runs.service';
import { OpenaiThreadsService } from 'src/modules/openai/services/openai.threads.service';
import { PromptCreatorService } from 'src/modules/prompt-creator/services/prompt-creator.service';
import { ResponseObject } from '../interfaces/interfaces';
import { Thread } from 'openai/resources/beta/threads/threads';
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages';
import { UserMessage } from 'src/shared/interfaces/interfaces';
@Injectable()
export class HavenAiAgentService {
  constructor(
    private readonly promptCreatorService: PromptCreatorService,
    private readonly openaiThreadsService: OpenaiThreadsService,
    private readonly openaiMessagesService: OpenaiMessagesService,
    private readonly openaiRunsService: OpenaiRunsService,
    private readonly assistantsQuestionerService: AssistantsQuestionerService,
    private readonly assistantsTerminatorService: AssistantsTerminatorService,
  ) {}

  async generateFirstQuestion(
    generateFirstQuestionDto: GenerateFirstQuestionDto,
  ): Promise<ResponseObject> {
    try {
      const thread: Thread = await this.openaiThreadsService.createThread();

      const firstPrompt: UserMessage =
        this.promptCreatorService.createFirstPrompt(generateFirstQuestionDto);

      await this.openaiMessagesService.createMessage(thread.id, firstPrompt);

      const run = await this.openaiRunsService.runThread(
        thread.id,
        this.assistantsQuestionerService.getAssistant().id,
      );

      await this.openaiRunsService.retrieveRun(thread.id, run.id);

      const threadMessages: ThreadMessage[] =
        await this.openaiMessagesService.listMessages(thread.id);

      if ('text' in threadMessages[0].content[0]) {
        return {
          response: threadMessages[0].content[0].text.value,
          isStoryGoodEnough: false,
          threadId: thread.id,
        };
      } else {
        throw new HttpException(
          'Message content does not have the right format',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw new HttpException(
        'Something went wrong during the first question being generated',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async generateFollowUpQuestion(
    generateFollowUpQuestionDto: GenerateFollowUpQuestionDto,
  ): Promise<ResponseObject> {
    const { refugeeResponse, threadId } = generateFollowUpQuestionDto;

    const followUpPrompt =
      this.promptCreatorService.createFollowUpPrompt(refugeeResponse);

    await this.openaiMessagesService.createMessage(threadId, followUpPrompt);

    const isStoryGoodEnough =
      await this.assistantsTerminatorService.determineIfStoryIsGoodEnough(
        threadId,
        this.openaiMessagesService,
        this.openaiThreadsService,
        this.openaiRunsService,
      );
    if (isStoryGoodEnough) {
      return {
        response: null,
        isStoryGoodEnough: true,
        threadId,
      };
    }

    const run = await this.openaiRunsService.runThread(
      threadId,
      this.assistantsQuestionerService.getAssistant().id,
    );

    await this.openaiRunsService.retrieveRun(threadId, run.id);

    const threadMessages: ThreadMessage[] =
      await this.openaiMessagesService.listMessages(threadId);

    if ('text' in threadMessages[0].content[0]) {
      return {
        response: threadMessages[0].content[0].text.value,
        isStoryGoodEnough: false,
        threadId,
      };
    } else {
      throw new HttpException(
        'Message content does not have the right format',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
