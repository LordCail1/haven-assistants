import { plainToInstance } from 'class-transformer';
import { GenerateFollowUpQuestionDto } from '../../dto/generate-followUp-question.dto';
import { generateFollowupQuestionDtoStub } from '../stubs/generate-followup-question.dto.stub';
import { validate } from 'class-validator';

describe('GenerateFollowUpQuestionDto', () => {
  let generateFollowUpQuestionDto: GenerateFollowUpQuestionDto;

  beforeEach(() => {
    generateFollowUpQuestionDto = generateFollowupQuestionDtoStub();
  });

  function createValidDto(
    overrides: Partial<GenerateFollowUpQuestionDto> = {},
  ): GenerateFollowUpQuestionDto {
    const validDto = new GenerateFollowUpQuestionDto();
    validDto.refugeeResponse = generateFollowUpQuestionDto.refugeeResponse;
    validDto.threadId = generateFollowUpQuestionDto.threadId;
    return {
      ...validDto,
      ...overrides,
    };
  }

  it('should be defined', () => {
    expect(generateFollowUpQuestionDto).toBeDefined();
  });

  describe('refugeeResponse', () => {
    describe('has to be defined', () => {
      it('1st version', async () => {
        const generateFollowUpQuestionDto = createValidDto({
          refugeeResponse: '',
        });
        const dto = plainToInstance(
          GenerateFollowUpQuestionDto,
          generateFollowUpQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });

      it('2nd version', async () => {
        const generateFollowUpQuestionDto = createValidDto();
        delete generateFollowUpQuestionDto.refugeeResponse;
        const dto = plainToInstance(
          GenerateFollowUpQuestionDto,
          generateFollowUpQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });
    });

    describe('has to be a string', () => {
      it('1st version', async () => {
        const generateFollowUpQuestionDto = createValidDto({
          refugeeResponse: 123 as any,
        });
        const dto = plainToInstance(
          GenerateFollowUpQuestionDto,
          generateFollowUpQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isString');
      });
    });

    describe('has to have at least 1 character', () => {
      it('1st version', async () => {
        const generateFollowUpQuestionDto = createValidDto({
          refugeeResponse: '',
        });
        const dto = plainToInstance(
          GenerateFollowUpQuestionDto,
          generateFollowUpQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('minLength');
      });
    });

    describe('has to have at most 10 000 characters', () => {
      it('1st version', async () => {
        const generateFollowUpQuestionDto = createValidDto({
          refugeeResponse: 'a'.repeat(10001),
        });
        const dto = plainToInstance(
          GenerateFollowUpQuestionDto,
          generateFollowUpQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('maxLength');
      });
    });
  });

  describe('threadId', () => {
    describe('has to be defined', () => {
      it('1st version', async () => {
        const generateFollowUpQuestionDto = createValidDto({
          threadId: '',
        });
        const dto = plainToInstance(
          GenerateFollowUpQuestionDto,
          generateFollowUpQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });

      it('2nd version', async () => {
        const generateFollowUpQuestionDto = createValidDto();
        delete generateFollowUpQuestionDto.threadId;
        const dto = plainToInstance(
          GenerateFollowUpQuestionDto,
          generateFollowUpQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });
    });

    describe('has to be a string', () => {
      it('1st version', async () => {
        const generateFollowUpQuestionDto = createValidDto({
          threadId: 123 as any,
        });
        const dto = plainToInstance(
          GenerateFollowUpQuestionDto,
          generateFollowUpQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isString');
      });
    });

    describe('has to have at least 1 character', () => {
      it('1st version', async () => {
        const generateFollowUpQuestionDto = createValidDto({
          threadId: '',
        });
        const dto = plainToInstance(
          GenerateFollowUpQuestionDto,
          generateFollowUpQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('minLength');
      });
    });

    describe('has to have at most 5000 characters', () => {
      it('1st version', async () => {
        const generateFollowUpQuestionDto = createValidDto({
          threadId: 'a'.repeat(5001),
        });
        const dto = plainToInstance(
          GenerateFollowUpQuestionDto,
          generateFollowUpQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('maxLength');
      });
    });
  });
});
