import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../entities/user.entity';
import { UserDocument, UserSchemaClass } from '../models/user.schema';
import { IUserRepository } from '../interfaces/interfaces';

/**
 * Mongoose implementation of the User repository
 */
@Injectable()
export class MongooseUserRepository implements IUserRepository {
  /**
   * @param userModel - Mongoose model for a user
   */
  constructor(
    @InjectModel(UserSchemaClass.name)
    private userModel: Model<UserSchemaClass>,
  ) {}

  async create(user: User): Promise<UserDocument> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }
}
