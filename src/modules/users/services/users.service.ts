import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { MongooseUserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';
import { IUsersService } from '../interfaces/interfaces';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    private readonly mongooseUserRepository: MongooseUserRepository,
  ) {}
  create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const user = new User();
    user.setEmail(email);
    return this.mongooseUserRepository.create(user);
  }
}
