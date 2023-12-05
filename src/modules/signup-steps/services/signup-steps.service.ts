import { Injectable } from '@nestjs/common';
import { CreateSignupStepDto } from '../dto/create-signup-step.dto';

@Injectable()
export class SignupStepsService {
  create(createSignupStepDto: CreateSignupStepDto) {
    return 'This action adds a new signupStep';
  }

  findAll() {
    return `This action returns all signupSteps`;
  }

  findOne(id: number) {
    return `This action returns a #${id} signupStep`;
  }

  remove(id: number) {
    return `This action removes a #${id} signupStep`;
  }
}
