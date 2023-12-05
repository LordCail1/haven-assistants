import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { Controller, Post, Body } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    const createdUser = await this.usersService.create(createUserDto);
    return createdUser;
  }
}
