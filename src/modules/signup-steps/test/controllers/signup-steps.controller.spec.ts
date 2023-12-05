import { Test, TestingModule } from '@nestjs/testing';
import { SignupStepsController } from '../../controllers/signup-steps.controller';
import { SignupStepsService } from '../../services/signup-steps.service';

describe('SignupStepsController', () => {
  let controller: SignupStepsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignupStepsController],
      providers: [SignupStepsService],
    }).compile();

    controller = module.get<SignupStepsController>(SignupStepsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
