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
import { AssistantsTerminatorService } from 'src/modules/assistants/services/terminator/assistants.terminator.service';
import { ThreadCreateParams } from 'openai/resources/beta/threads/threads';
import { ResponseObject } from '../interfaces/interfaces';
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

    const threadMessages: ThreadMessage[] =
      await this.openaiMessagesService.listMessages(thread.id);

    if ('text' in threadMessages[0].content[0]) {
      return {
        response: threadMessages[0].content[0].text.value,
        isStoryGoodEnough: false,
        threadId: thread.id,
      };
    } else {
      throw new Error('Message content does not have the right format');
    }
  }

  async generateFollowUpQuestion(
    generateFollowUpQuestionDto: GenerateFollowUpQuestionDto,
  ): Promise<ResponseObject> {
    const { refugeeResponse, threadId } = generateFollowUpQuestionDto;

    const followUpPrompt =
      this.promptCreatorService.createFollowUpPrompt(refugeeResponse);

    await this.openaiMessagesService.createMessage(threadId, followUpPrompt);

    const isStoryGoodEnough = await this.determineIfStoryIsGoodEnough(threadId);
    if (isStoryGoodEnough) {
      return {
        response: null,
        isStoryGoodEnough: true,
        threadId,
      };
    }

    const questionerAssistant: Assistant =
      this.assistantsQuestionerService.getAssistant();

    const run = await this.openaiRunsService.runThread(
      threadId,
      questionerAssistant.id,
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
      throw new Error('Message content does not have the right format');
    }
  }

  /**
   * Choses if the conversation should continue or not
   * @param refugeeResponse What the refugee has responded to the least generated question
   * @param threadId the thread id to find the conversation between the refugee and the questioner
   * @returns a boolean value representing if the story is good enough or not
   */
  private async determineIfStoryIsGoodEnough(
    threadId: string,
  ): Promise<boolean> {
    const threadMessagesBeforeVerification: ThreadMessage[] =
      await this.openaiMessagesService.listMessages(threadId);

    const messages: ThreadCreateParams.Message[] =
      await this.convertThreadMessagesToMessageArray(
        threadMessagesBeforeVerification,
      );

    const terminatorThread = await this.openaiThreadsService.createThread({
      messages,
    });

    const run = await this.openaiRunsService.runThread(
      terminatorThread.id,
      this.assistantsTerminatorService.getAssistant().id,
    );

    await this.openaiRunsService.retrieveRun(terminatorThread.id, run.id);

    const terminatorThreadMessages: ThreadMessage[] =
      await this.openaiMessagesService.listMessages(terminatorThread.id);

    if ('text' in terminatorThreadMessages[0].content[0]) {
      const terminatorResponseText: string =
        terminatorThreadMessages[0].content[0].text.value;

      const isStoryGoodEnough = this.parseLastResponseForJson(
        terminatorResponseText,
      );

      if (isStoryGoodEnough) {
        return true;
      } else return false;
    } else {
      throw new Error('Message content does not have the right format');
    }

    /**
     * 1. retrieve all messages from original thread between refugee and questioner.
     * 2. create new thread with those messages injected
     * 3. create run on the new thread with the terminator assistant
     * 4. retrieve the run
     * 5. parse the response for the JSON that will be inside.
     */
    return false;
  }

  /**
   * Converts the thread messages from one format to another
   * @param threadMessages the thread messages that are in the format 'ThreadMessage[]'
   * @returns an array of messages that is in the format 'Message[]'
   */
  private async convertThreadMessagesToMessageArray(
    threadMessages: ThreadMessage[],
  ): Promise<ThreadCreateParams.Message[]> {
    return threadMessages.map((message: ThreadMessage) => {
      if ('text' in message.content[0]) {
        return {
          content: message.content[0].text.value,
          role: 'user',
        };
      } else {
        throw new Error('Message content contained files is not text');
      }
    });
  }

  parseLastResponseForJson(response: string): boolean {
    console.log(response);
    try {
      const parsedJson = JSON.parse(response);
      const isStoryGoodEnough = parsedJson.isStoryGoodEnough;
      if (typeof isStoryGoodEnough !== 'boolean') {
        throw new Error('isStoryGoodEnough is not a boolean');
      }
      return isStoryGoodEnough;
    } catch (error) {
      console.log('something went wrong parsinng the json!', error);
    }
  }
}
