import { AssistantsQuestionerService } from 'src/modules/assistants/services/questioner/assistants.questioner.service';
import { AssistantsSummarizerService } from 'src/modules/assistants/services/summarizer/assistants.summarizer.service';
import { AssistantsTerminatorService } from 'src/modules/assistants/services/terminator/assistants.terminator.service';
import { GenerateFirstQuestionDto } from '../dto/generate-first-question.dto';
import { GenerateFollowUpQuestionDto } from '../dto/generate-followup-question.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ImageNotTextException } from 'src/shared/exceptions/image-not-text.exception';
import { OpenaiMessagesService } from 'src/modules/openai/services/messages/openai.messages.service';
import { OpenaiRunsService } from 'src/modules/openai/services/runs/openai.runs.service';
import { OpenaiThreadsService } from 'src/modules/openai/services/threads/openai.threads.service';
import { PromptCreatorService } from 'src/modules/prompt-creator/services/prompt-creator.service';
import { ResponseObject } from '../interfaces/interfaces';
import { Run } from 'openai/resources/beta/threads/runs/runs';
import { Thread } from 'openai/resources/beta/threads/threads';
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages';
import { UserMessage } from 'src/shared/interfaces/interfaces';

/**
 * This service is responsible for managing the Haven AI agent.
 * It orchestrates the behavior of multiple assistants.
 * In the end, it is responsible for achiving what Haven needs with the OpenAI API.
 */
@Injectable()
export class HavenAiAgentService {
  constructor(
    private readonly promptCreatorService: PromptCreatorService,
    private readonly openaiThreadsService: OpenaiThreadsService,
    private readonly openaiMessagesService: OpenaiMessagesService,
    private readonly openaiRunsService: OpenaiRunsService,
    private readonly assistantsQuestionerService: AssistantsQuestionerService,
    private readonly assistantsTerminatorService: AssistantsTerminatorService,
    private readonly assistantsSummarizerService: AssistantsSummarizerService,
  ) {}

  /**
   * this method is responsible for generating the first question that will be sent to the AI assistant.
   * @param generateFirstQuestionDto The DTO that contains the information that the refugee provided.
   * @returns the first question in the correct format
   */
  async generateFirstQuestion(
    generateFirstQuestionDto: GenerateFirstQuestionDto,
  ): Promise<ResponseObject> {
    try {
      const thread: Thread = await this.openaiThreadsService.createThread();

      const firstPrompt: UserMessage =
        this.promptCreatorService.createFirstPrompt(generateFirstQuestionDto);

      await this.openaiMessagesService.createMessage(thread.id, firstPrompt);

      const run: Run = await this.openaiRunsService.createRun(
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
        throw new ImageNotTextException();
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * This method is responsible for generating the follow up question that will be sent to the AI assistant.
   * @param generateFollowUpQuestionDto - The DTO that contains the answer tha the refugee provided.
   * @returns - The answer to the followup quesiton
   */
  async generateFollowUpQuestion(
    generateFollowUpQuestionDto: GenerateFollowUpQuestionDto,
  ): Promise<ResponseObject> {
    try {
      const { refugeeResponse, threadId } = generateFollowUpQuestionDto;

      const followUpPrompt: UserMessage =
        this.promptCreatorService.createFollowUpPrompt(refugeeResponse);

      await this.openaiMessagesService.createMessage(threadId, followUpPrompt);

      const isStoryGoodEnough: boolean =
        await this.assistantsTerminatorService.determineIfStoryIsGoodEnough(
          threadId,
        );
      if (isStoryGoodEnough) {
        const summarizedStory =
          await this.assistantsSummarizerService.createSummary(threadId);
        console.log(summarizedStory);
        return {
          isStoryGoodEnough: true,
          summarizedStory,
          threadId,
        };
      }

      const run: Run = await this.openaiRunsService.createRun(
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
        throw new ImageNotTextException();
      }
    } catch (error) {
      throw new HttpException(
        'Something went wrong during the follow up question being generated',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
