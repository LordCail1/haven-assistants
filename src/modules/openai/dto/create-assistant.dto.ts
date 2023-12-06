import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { AssistantCreateParams } from 'openai/resources/beta/assistants/assistants';
import { MyAssistantCreateParams } from '../interfaces/interfaces';

/**
 * This Dto object is used to create an assistant
 */
export class CreateAssistantDto implements MyAssistantCreateParams {
  /**
   * ID of the model to use. You can use the
   * [List models](https://platform.openai.com/docs/api-reference/models/list) API to
   * see all of your available models, or see our
   * [Model overview](https://platform.openai.com/docs/models/overview) for
   * descriptions of them.
   */
  @IsNotEmpty()
  @IsString()
  model: 'gpt-4-1106-preview';

  /**
   * The description of the assistant. The maximum length is 512 characters.
   */
  @IsOptional()
  @IsString()
  @MaxLength(512)
  description?: string | null;

  /**
   * A list of [file](https://platform.openai.com/docs/api-reference/files) IDs
   * attached to this assistant. There can be a maximum of 20 files attached to the
   * assistant. Files are ordered by their creation date in ascending order.
   */
  @IsOptional()
  @IsString({ each: true })
  file_ids?: string[];

  /**
   * The system instructions that the assistant uses. The maximum length is 32768
   * characters.
   */
  @IsOptional()
  @IsString()
  @MaxLength(32768)
  instructions?: string | null;

  /**
   * Set of 16 key-value pairs that can be attached to an object. This can be useful
   * for storing additional information about the object in a structured format. Keys
   * can be a maximum of 64 characters long and values can be a maxium of 512
   * characters long.
   */
  @IsOptional()
  @IsObject()
  metadata?: unknown | null;

  /**
   * The name of the assistant. The maximum length is 256 characters.
   */
  @IsOptional()
  @IsString()
  @MaxLength(256)
  name?: string | null;

  /**
   * A list of tool enabled on the assistant. There can be a maximum of 128 tools per
   * assistant. Tools can be of types `code_interpreter`, `retrieval`, or `function`.
   */
  @IsOptional()
  @IsArray()
  tools?: Array<
    | AssistantCreateParams.AssistantToolsCode
    | AssistantCreateParams.AssistantToolsRetrieval
    | AssistantCreateParams.AssistantToolsFunction
  >;
}
