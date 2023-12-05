import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * User Document
 */
export type UserDocument = HydratedDocument<UserSchemaClass>;

/**
 * Schema class for User
 */
@Schema()
export class UserSchemaClass {
  @Prop({
    required: true,
    minlength: 3,
    maxlength: 200,
    trim: true,
    unique: true,
  })
  email: string;
}

/**
 * Actual Schema for User after converson
 */
export const UserSchema = SchemaFactory.createForClass(UserSchemaClass);
