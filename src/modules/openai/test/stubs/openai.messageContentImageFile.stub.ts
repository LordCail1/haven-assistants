import { MessageContentImageFile } from 'openai/resources/beta/threads/messages/messages';
import { v4 as uuid } from 'uuid';

/**
 * returns a message content image file stub
 * @returns a message content image file stub
 */
export const messageContentImageFileStub = (): MessageContentImageFile => {
  return {
    image_file: {
      file_id: uuid(),
    },
    type: 'image_file',
  };
};
