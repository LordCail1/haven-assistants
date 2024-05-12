import { AssistantsQuestionerService } from 'src/modules/assistants/services/questioner/assistants.questioner.service';
import { AssistantsSummarizerService } from 'src/modules/assistants/services/summarizer/assistants.summarizer.service';
import { AssistantsTerminatorService } from 'src/modules/assistants/services/terminator/assistants.terminator.service';
import { GenerateFirstQuestionDto } from '../dto/generate-first-question.dto';
import { GenerateFirstQuestionException } from '../exceptions/generate-first-question.exception';
import { GenerateFollowUpQuestionDto } from '../dto/generate-followUp-question.dto';
import { GenerateFollowUpQuestionException } from '../exceptions/generate-follow-up-question.exception';
import { HttpException, Injectable } from '@nestjs/common';
import { ImageNotTextException } from 'src/shared/exceptions/image-not-text.exception';
import { OpenaiMessagesService } from 'src/modules/openai/services/messages/openai.messages.service';
import { OpenaiRunsService } from 'src/modules/openai/services/runs/openai.runs.service';
import { OpenaiThreadsService } from 'src/modules/openai/services/threads/openai.threads.service';
import { PromptCreatorService } from 'src/modules/prompt-creator/services/prompt-creator.service';
import { ResponseObject } from '../dto/response-object.dto';
import { Run } from 'openai/resources/beta/threads/runs/runs';
import { Thread } from 'openai/resources/beta/threads/threads';
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages';
import { UserMessage } from 'src/shared/interfaces/interfaces';
import { AssistantsCriteriaParserService } from 'src/modules/assistants/services/criteriaParser/assistants.criteriaParser.service';
import { MyLogger } from 'src/modules/logger/services/logger.service';
import { AssistantsLanguageSimplifierService } from 'src/modules/assistants/services/languageSimplifier/assistants.languageSimplifier.service';

/**
 * This service is responsible for managing the Haven AI agent.
 * It orchestrates the behavior of multiple assistants.
 * In the end, it is responsible for achiving what Haven needs with the OpenAI API.
 */
@Injectable()
export class HavenAiAgentService {
  constructor(
    private readonly assistantsCriteriaParserService: AssistantsCriteriaParserService,
    private readonly assistantsLanguageSimplifierService: AssistantsLanguageSimplifierService,
    private readonly assistantsQuestionerService: AssistantsQuestionerService,
    private readonly assistantsSummarizerService: AssistantsSummarizerService,
    private readonly assistantsTerminatorService: AssistantsTerminatorService,
    private readonly openaiMessagesService: OpenaiMessagesService,
    private readonly openaiRunsService: OpenaiRunsService,
    private readonly openaiThreadsService: OpenaiThreadsService,
    private readonly promptCreatorService: PromptCreatorService,
    private readonly myLogger: MyLogger,
  ) {}

  /**
   * This method is responsible for generating the first question that will be sent to the AI assistant.
   * @param generateFirstQuestionDto The DTO that contains the information that the refugee provided.
   * @returns The first question in the correct format
   */
  async generateFirstQuestion(
    generateFirstQuestionDto: GenerateFirstQuestionDto,
  ): Promise<ResponseObject> {
    try {
      //creating the thread for criteriaParser
      const criteriaParserThread: Thread =
        await this.openaiThreadsService.createThread();
      this.myLogger.debug(
        'criteriaParser thread created',
        criteriaParserThread,
      );

      //creating the first prompt for criteriaParser
      const firstPromptForCriteriaParser: UserMessage =
        this.promptCreatorService.createPromptForCriteriaParser(
          generateFirstQuestionDto,
        );
      this.myLogger.debug(
        'first prompt for criteriaParser created',
        firstPromptForCriteriaParser,
      );

      //creating the first message for criteriaParser
      await this.openaiMessagesService.createMessage(
        criteriaParserThread.id,
        firstPromptForCriteriaParser,
      );
      this.myLogger.debug('first message for criteriaParser created');

      //creating the run for criteriaParser
      const criteriaParserRun: Run = await this.openaiRunsService.createRun(
        criteriaParserThread.id,
        this.assistantsCriteriaParserService.getAssistant().id,
      );
      this.myLogger.debug('criteriaParser run created', criteriaParserRun);

      //retrieving the run for criteriaParser
      await this.openaiRunsService.retrieveRun(
        criteriaParserThread.id,
        criteriaParserRun.id,
      );
      this.myLogger.debug('criteriaParser run retrieved', criteriaParserRun);

      //retrieving the messages for criteriaParser
      const criteriaParserThreadMessages: ThreadMessage[] =
        await this.openaiMessagesService.listMessages(criteriaParserThread.id);
      this.myLogger.debug(
        'criteriaParser thread messages retrieved',
        criteriaParserThreadMessages,
      );

      let criteriaParserResponse: string;

      if ('text' in criteriaParserThreadMessages[0].content[0]) {
        criteriaParserResponse =
          criteriaParserThreadMessages[0].content[0].text.value;
        this.myLogger.debug(criteriaParserResponse);
      } else {
        throw new ImageNotTextException();
      }

      //-------

      const thread: Thread = await this.openaiThreadsService.createThread();
      this.myLogger.debug('Questioner thread created', thread);

      const firstPromptForQuestioner: UserMessage =
        this.promptCreatorService.createFirstPromptForQuestioner(
          generateFirstQuestionDto,
          criteriaParserResponse,
        );
      this.myLogger.debug(
        'first prompt for questioner created',
        firstPromptForQuestioner,
      );

      await this.openaiMessagesService.createMessage(
        thread.id,
        firstPromptForQuestioner,
      );
      this.myLogger.debug('first message for questioner created');

      const run: Run = await this.openaiRunsService.createRun(
        thread.id,
        this.assistantsQuestionerService.getAssistant().id,
      );
      this.myLogger.debug('Questioner run created', run);

      await this.openaiRunsService.retrieveRun(thread.id, run.id);
      this.myLogger.debug('Questioner run retrieved', run);

      const threadMessages: ThreadMessage[] =
        await this.openaiMessagesService.listMessages(thread.id);
      this.myLogger.debug(
        'Questioner thread messages retrieved',
        threadMessages,
      );

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
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new GenerateFirstQuestionException(error);
      }
    }
  }

  /**
   * This method is responsible for generating the follow up question that will be sent to the AI assistant.
   * @param generateFollowUpQuestionDto The DTO that contains the answer tha the refugee provided.
   * @returns The answer to the follow-up quesiton
   */
  async generateFollowUpQuestion(
    generateFollowUpQuestionDto: GenerateFollowUpQuestionDto,
  ): Promise<ResponseObject> {
    try {
      const { refugeeResponse, threadId } = generateFollowUpQuestionDto;

      const followUpPrompt: UserMessage =
        this.promptCreatorService.createFollowUpPrompt(refugeeResponse);
      this.myLogger.debug('follow up prompt created', followUpPrompt);

      await this.openaiMessagesService.createMessage(threadId, followUpPrompt);
      this.myLogger.debug('follow up message created');

      const isStoryGoodEnough: boolean =
        await this.assistantsTerminatorService.determineIfStoryIsGoodEnough(
          threadId,
        );
      this.myLogger.debug('is story good enough', isStoryGoodEnough);

      if (isStoryGoodEnough) {
        const summarizedStory =
          await this.assistantsSummarizerService.createSummary(threadId);
        this.myLogger.debug('summarized story', summarizedStory);

        const simplifiedStory =
          await this.assistantsLanguageSimplifierService.simplifyLanguage(
            threadId,
          );

        await this.openaiThreadsService.deleteThread(threadId);
        this.myLogger.log('thread deleted', threadId);

        return {
          isStoryGoodEnough: true,
          simplifiedStory,
          threadId,
        };
      }

      const run: Run = await this.openaiRunsService.createRun(
        threadId,
        this.assistantsQuestionerService.getAssistant().id,
      );
      this.myLogger.debug('Questioner run created', run);

      await this.openaiRunsService.retrieveRun(threadId, run.id);
      this.myLogger.debug('Questioner run retrieved', run);

      const threadMessages: ThreadMessage[] =
        await this.openaiMessagesService.listMessages(threadId);
      this.myLogger.debug(
        'Questioner thread messages retrieved',
        threadMessages,
      );

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
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new GenerateFollowUpQuestionException(error);
      }
    }
  }
}
