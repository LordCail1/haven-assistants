import OpenAI from 'openai';

/**
 * Represents a thread in the OpenAI API
 */
export type Thread = OpenAI.Beta.Threads.Thread;

/**
 * This is the type for an assistant in the OpenAI API
 */
export type Assistant = OpenAI.Beta.Assistants.Assistant;
