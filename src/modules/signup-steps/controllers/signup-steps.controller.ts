import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { SignupStepsService } from '../services/signup-steps.service';
import { CreateSignupStepDto } from '../dto/create-signup-step.dto';

@Controller('signup-steps')
export class SignupStepsController {
  constructor(private readonly signupStepsService: SignupStepsService) {}

  @Post()
  create(@Body() createSignupStepDto: CreateSignupStepDto) {
    return this.signupStepsService.create(createSignupStepDto);
  }

  @Get()
  findAll() {
    return this.signupStepsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.signupStepsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.signupStepsService.remove(+id);
  }
}
