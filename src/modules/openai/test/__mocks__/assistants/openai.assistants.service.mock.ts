import { AssistantName } from 'src/modules/assistants/enums/enums';
import { assistantStub } from '../../stubs/openai.assistant.stub';
import {
  Assistant,
  AssistantCreateParams,
} from 'openai/resources/beta/assistants';

/**
 * Mock of OpenAI Assistants Service
 */
export const openaiAssistantsServiceMock = {
  listAllAssistants: jest
    .fn()
    .mockImplementation((): Promise<{ data: Assistant[] }> => {
      const assistants: Assistant[] = [];

      const terminator: Assistant = assistantStub();
      terminator.name = AssistantName.TERMINATOR;
      assistants.push(terminator);

      const summarizer: Assistant = assistantStub();
      summarizer.name = AssistantName.SUMMARIZER;
      assistants.push(summarizer);

      const refugee: Assistant = assistantStub();
      refugee.name = AssistantName.REFUGEE;
      assistants.push(refugee);

      const questioner: Assistant = assistantStub();
      questioner.name = AssistantName.QUESTIONER;
      assistants.push(questioner);

      const criteriaParser: Assistant = assistantStub();
      criteriaParser.name = AssistantName.CRITERIA_PARSER;
      assistants.push(criteriaParser);

      const languageSimplifier: Assistant = assistantStub();
      languageSimplifier.name = AssistantName.LANGUAGE_SIMPLIFIER;
      assistants.push(languageSimplifier);

      return Promise.resolve({ data: assistants });
    }),
  createAssistant: jest
    .fn()
    .mockImplementation(
      (assistantCreateParams: AssistantCreateParams): Promise<Assistant> => {
        const {
          name,
          model,
          description,
          response_format,
          temperature,
          tool_resources,
          top_p,
          instructions,
          metadata,
          tools,
        } = assistantCreateParams;

        const assistant: Assistant = assistantStub();
        assistant.name = name;
        assistant.model = model;
        assistant.description = description;
        assistant.response_format = response_format;
        assistant.temperature = temperature;
        assistant.tool_resources = tool_resources;
        assistant.top_p = top_p;
        assistant.instructions = instructions;
        assistant.metadata = metadata;
        assistant.tools = tools;

        return Promise.resolve(assistant);
      },
    ),
  deleteAssistant: jest.fn(),
};
