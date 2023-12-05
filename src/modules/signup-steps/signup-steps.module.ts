import { Module } from '@nestjs/common';
import { SignupStepsService } from './services/signup-steps.service';
import { SignupStepsController } from './controllers/signup-steps.controller';

@Module({
  controllers: [SignupStepsController],
  providers: [SignupStepsService],
})
export class SignupStepsModule {}
