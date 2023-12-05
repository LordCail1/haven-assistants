import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UserSchema, UserSchemaClass } from './models/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseUserRepository } from './repositories/user.repository';

/**
 * This module is responsible for handling all user-related functionality.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserSchemaClass.name, schema: UserSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, MongooseUserRepository],
})
export class UsersModule {}
