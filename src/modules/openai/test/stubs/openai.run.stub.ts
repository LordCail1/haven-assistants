import { Run } from 'openai/resources/beta/threads/runs/runs';
import { v4 as uuid } from 'uuid';
import { Gpt_Models } from '../../enums/enums';
/**
 * returns a run stub
 * @returns a run stub
 */
export const runStub = (): Run => {
  return {
    assistant_id: uuid(),
    cancelled_at: null,
    completed_at: null,
    created_at: new Date().getTime(),
    expires_at: new Date().getTime(),
    failed_at: null,
    id: uuid(),
    incomplete_details: null,
    instructions: 'random instructions',
    last_error: null,
    max_completion_tokens: null,
    max_prompt_tokens: null,
    metadata: null,
    model: Gpt_Models.GPT_VERSION,
    object: 'thread.run',
    required_action: null,
    response_format: null,
    started_at: null,
    status: 'in_progress',
    temperature: null,
    thread_id: uuid(),
    tool_choice: null,
    tools: [{ type: 'code_interpreter' }],
    top_p: null,
    truncation_strategy: null,
    usage: null,
  };
};
