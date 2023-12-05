import { Test, TestingModule } from '@nestjs/testing';
import { SignupStepsService } from '../../services/signup-steps.service';

describe('SignupStepsService', () => {
  let service: SignupStepsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignupStepsService],
    }).compile();

    service = module.get<SignupStepsService>(SignupStepsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
