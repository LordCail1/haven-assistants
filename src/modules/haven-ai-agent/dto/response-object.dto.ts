/**
 * The response object that can supply all the informtion needed for what haven needs from the AI assistant.
 */
export class ResponseObject {
  isStoryGoodEnough: boolean;
  response?: string;
  summarizedStory?: string;
  threadId: string;
}
