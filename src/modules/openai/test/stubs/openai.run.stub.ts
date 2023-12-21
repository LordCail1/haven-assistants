import { Run } from 'openai/resources/beta/threads/runs/runs';
import { v4 as uuid } from 'uuid';
import { Gpt_Models } from '../../enums/enums';
/**
 * returns a run stub
 * @returns a run stub
 */
export const runStub = (): Run => {
  return {
    id: uuid(),
    assistant_id: uuid(),
    cancelled_at: null,
    completed_at: null,
    created_at: new Date().getTime(),
    expires_at: new Date().getTime(),
    failed_at: null,
    file_ids: ['first_id'],
    instructions: 'random instructions',
    last_error: null,
    metadata: null,
    model: Gpt_Models.GPT_4_TURBO_1106_PREVIEW,
    object: 'thread.run',
    required_action: null,
    started_at: null,
    status: 'in_progress',
    thread_id: uuid(),
    tools: [{ type: 'code_interpreter' }],
  };
};
