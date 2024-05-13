import { Assistant } from 'openai/resources/beta/assistants/assistants';
import { AssistantName } from '../../enums/enums';
import { AssistantsAbstractService } from '../assistants.abstract.service';
import { GettingAssistantException } from '../../exceptions/geting-assistant.exception';
import { Gpt_Models } from 'src/modules/openai/enums/enums';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ImageNotTextException } from 'src/shared/exceptions/image-not-text.exception';
import { InitializingAssistantException } from '../../exceptions/initializing-assistant.exception';
import { SimplifyLanguageException } from '../../exceptions/languageSimplifier/simplify-language.exception';
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages';
import { PromptCreatorService } from 'src/modules/prompt-creator/services/prompt-creator.service';

/**
 * This service is responsible for the 'languageSimplifier' assistant.
 * The 'languageSimplifier' assistant is responsible for summarizing the story.
 */
@Injectable()
export class AssistantsLanguageSimplifierService extends AssistantsAbstractService {
  private assistant: Assistant;

  @Inject()
  private promptCreatorService: PromptCreatorService;

  getAssistant(): Assistant {
    if (this.assistant) {
      return this.assistant;
    } else {
      throw new GettingAssistantException(AssistantName.LANGUAGE_SIMPLIFIER);
    }
  }

  async initializeAssistant(): Promise<void> {
    try {
      const assistant: Assistant | undefined =
        await this.checkIfAssistantAlreadyExists(
          AssistantName.LANGUAGE_SIMPLIFIER,
        );
      if (assistant) {
        await this.openaiAssistantsService.deleteAssistant(assistant.id);
      }

      const instructions = await this.loadInstructions(
        __dirname,
        'v1/instructions.txt',
        AssistantName.LANGUAGE_SIMPLIFIER,
      );

      const description = await this.loadDescription(
        __dirname,
        'description.txt',
        AssistantName.LANGUAGE_SIMPLIFIER,
      );

      this.assistant = await this.openaiAssistantsService.createAssistant({
        name: AssistantName.LANGUAGE_SIMPLIFIER,
        description,
        instructions,
        model: Gpt_Models.GPT_VERSION,
      });
    } catch (error) {
      throw new InitializingAssistantException(
        AssistantName.LANGUAGE_SIMPLIFIER,
        error,
      );
    }
  }

  /**
   * This method is responsible for simplifying the story that comes from the 'summarizer'.
   * @param threadId The thread id that is used to identify the conversation between the refugee and the 'questioner'.
   * @returns The summary of the story.
   */
  async simplifyLanguage(summarizedText: string): Promise<string> {
    try {
      //create the thread for the language simplifier
      const thread = await this.openaiThreadsService.createThread();

      this.myLogger.debug('language simplifier thread created', thread);

      this.promptCreatorService.createPromptForLanguageSimplifier(
        summarizedText,
      );

      const run = await this.openaiRunsService.createRun(
        thread.id,
        this.assistant.id,
      );

      this.myLogger.debug('run', run);

      await this.openaiRunsService.retrieveRun(thread.id, run.id);

      const messages: ThreadMessage[] =
        await this.openaiMessagesService.listMessages(thread.id);

      this.myLogger.debug('messages', messages);

      if ('text' in messages[0].content[0]) {
        this.myLogger.debug(
          'text in messages[0].content[0]',
          messages[0].content[0].text.value,
        );
        return messages[0].content[0].text.value;
      } else {
        throw new ImageNotTextException();
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new SimplifyLanguageException(error);
      }
    }
  }
}
