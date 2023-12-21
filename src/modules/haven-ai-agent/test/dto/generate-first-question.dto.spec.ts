import { plainToInstance } from 'class-transformer';
import { GenerateFirstQuestionDto } from '../../dto/generate-first-question.dto';
import { validate } from 'class-validator';
import { generateFirstQuestionDtoStub } from '../stubs/generate-first-question.dto.stub';

describe('GenerateFirstQuestionDto', () => {
  let generateFirstQuestionDto: GenerateFirstQuestionDto;

  beforeEach(() => {
    generateFirstQuestionDto = generateFirstQuestionDtoStub();
  });

  function createValidDto(
    overrides: Partial<GenerateFirstQuestionDto> = {},
  ): GenerateFirstQuestionDto {
    const validDto = new GenerateFirstQuestionDto();
    validDto.countryOfBirth = generateFirstQuestionDto.countryOfBirth;
    validDto.currentCity = generateFirstQuestionDto.currentCity;
    validDto.currentCountry = generateFirstQuestionDto.currentCountry;
    validDto.currentProvinceOrTerritory =
      generateFirstQuestionDto.currentProvinceOrTerritory;
    validDto.email = generateFirstQuestionDto.email;
    validDto.familyName = generateFirstQuestionDto.familyName;
    validDto.familyStructure = generateFirstQuestionDto.familyStructure;
    validDto.gender = generateFirstQuestionDto.gender;
    validDto.highestEducation = generateFirstQuestionDto.highestEducation;
    validDto.howManyPeopleInYourGroup =
      generateFirstQuestionDto.howManyPeopleInYourGroup;
    validDto.languages = generateFirstQuestionDto.languages;
    validDto.myStory = generateFirstQuestionDto.myStory;
    validDto.name = generateFirstQuestionDto.name;
    validDto.resettlementCity = generateFirstQuestionDto.resettlementCity;
    validDto.resettlementProvinceOrTerritory =
      generateFirstQuestionDto.resettlementProvinceOrTerritory;
    validDto.stageOfResettlement = generateFirstQuestionDto.stageOfResettlement;

    return {
      ...validDto,
      ...overrides,
    };
  }

  it('should be defined', () => {
    expect(generateFirstQuestionDto).toBeDefined();
  });

  it('should not give any errors if all properties are correct', async () => {
    const generateFirstQuestionDto = createValidDto();
    const dto = plainToInstance(
      GenerateFirstQuestionDto,
      generateFirstQuestionDto,
    );
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('name', () => {
    describe('has to be defined', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({ name: '' });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });

      it('2nd version', async () => {
        const generateFirstQuestionDto = createValidDto();
        delete generateFirstQuestionDto.name;
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });
    });

    describe('has to be a string', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({ name: 123 as any });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isString');
      });
    });

    describe('has to have at least 1 character', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({ name: '' });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('minLength');
      });
    });

    describe('has to have at most 500 characters', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          name: 'a'.repeat(501),
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('maxLength');
      });
    });
  });

  describe('familyName', () => {
    describe('has to be defined', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          familyName: '',
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });

      it('2nd version', async () => {
        const generateFirstQuestionDto = createValidDto();
        delete generateFirstQuestionDto.familyName;
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });
    });

    describe('has to be a string', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          familyName: 123 as any,
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isString');
      });
    });

    describe('has to have at least 1 character', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          familyName: '',
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('minLength');
      });
    });

    describe('has to have at most 500 characters', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          familyName: 'a'.repeat(501),
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('maxLength');
      });
    });
  });

  describe('email', () => {
    describe('has to be defined', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          email: '',
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);

        expect(errors[0].constraints).toHaveProperty('isEmail');
      });

      it('2nd version', async () => {
        const generateFirstQuestionDto = createValidDto();
        delete generateFirstQuestionDto.email;
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);

        expect(errors[0].constraints).toHaveProperty('isEmail');
      });
    });

    describe('has to be a valid email', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          email: 'invalid-email',
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isEmail');
      });
    });

    describe('has to have at most 500 characters', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          email: 'a'.repeat(501) + '@example.com',
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);

        expect(errors[0].constraints).toHaveProperty('maxLength');
      });
    });
  });

  describe('gender', () => {
    describe('has to be defined', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({ gender: '' });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });

      it('2nd version', async () => {
        const generateFirstQuestionDto = createValidDto();
        delete generateFirstQuestionDto.gender;
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });
    });

    describe('has to be a string', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({ gender: 123 as any });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isString');
      });
    });

    describe('has to have at least 1 character', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({ gender: '' });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('minLength');
      });
    });

    describe('has to have at most 500 characters', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          gender: 'a'.repeat(501),
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('maxLength');
      });
    });
  });

  describe('highestEducation', () => {
    describe('has to be defined', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          highestEducation: '',
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });

      it('2nd version', async () => {
        const generateFirstQuestionDto = createValidDto();
        delete generateFirstQuestionDto.highestEducation;
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });
    });

    describe('has to be a string', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          highestEducation: 123 as any,
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isString');
      });
    });

    describe('has to have at least 1 character', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          highestEducation: '',
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('minLength');
      });
    });

    describe('has to have at most 500 characters', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          highestEducation: 'a'.repeat(501),
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('maxLength');
      });
    });
  });

  describe('languages', () => {
    describe('array minimum size has to be 1', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          languages: [],
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);

        expect(errors[0].constraints).toHaveProperty('arrayMinSize');
      });
    });

    describe('has to be an array', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          languages: 'English' as any,
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isArray');
      });
    });

    describe('has to be defined', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          languages: undefined as any,
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });
    });

    describe('has to be an array of strings', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          languages: [1, 'test', 'test3'] as any,
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isString');
      });
    });

    describe('has to have at least 1 character', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          languages: [''],
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isLength');
      });
    });

    describe('has to have at most 200 characters', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          languages: ['a'.repeat(201)],
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isLength');
      });
    });
  });

  describe('myStory', () => {
    describe('has to be defined', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({ myStory: '' });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });

      it('2nd version', async () => {
        const generateFirstQuestionDto = createValidDto();
        delete generateFirstQuestionDto.myStory;
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });
    });

    describe('has to be a string', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          myStory: 123 as any,
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isString');
      });
    });

    describe('has to have at least 1 character', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({ myStory: '' });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('minLength');
      });
    });

    describe('has to have at most 5000 characters', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          myStory: 'a'.repeat(5001),
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);

        expect(errors[0].constraints).toHaveProperty('maxLength');
      });
    });
  });

  describe('countryOfBirth', () => {
    describe('has to be defined', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          countryOfBirth: '',
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });

      it('2nd version', async () => {
        const generateFirstQuestionDto = createValidDto();
        delete generateFirstQuestionDto.countryOfBirth;
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });
    });

    describe('has to be a string', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          countryOfBirth: 123 as any,
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isString');
      });
    });

    describe('has to have at least 1 character', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          countryOfBirth: '',
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('minLength');
      });
    });

    describe('has to have at most 500 characters', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          countryOfBirth: 'a'.repeat(501),
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('maxLength');
      });
    });
  });

  describe('familyStructure', () => {
    describe('has to be defined', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          familyStructure: '',
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });

      it('2nd version', async () => {
        const generateFirstQuestionDto = createValidDto();
        delete generateFirstQuestionDto.familyStructure;
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });
    });

    describe('has to be a string', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          familyStructure: 123 as any,
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isString');
      });
    });

    describe('has to have at least 1 character', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          familyStructure: '',
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('minLength');
      });
    });

    describe('has to have at most 500 characters', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          familyStructure: 'a'.repeat(501),
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('maxLength');
      });
    });
  });

  describe('howManyPeopleInYourGroup', () => {
    describe('has to be defined', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          howManyPeopleInYourGroup: undefined as any,
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);

        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });

      it('2nd version', async () => {
        const generateFirstQuestionDto = createValidDto();
        delete generateFirstQuestionDto.howManyPeopleInYourGroup;
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);

        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });
    });

    describe('has to be a number', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          howManyPeopleInYourGroup: '1' as any,
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);

        expect(errors[0].constraints).toHaveProperty('isNumber');
      });
    });
  });

  describe('resettlementProvinceOrTerritory', () => {
    describe('has to be defined', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          resettlementProvinceOrTerritory: '',
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });

      it('2nd version', async () => {
        const generateFirstQuestionDto = createValidDto();
        delete generateFirstQuestionDto.resettlementProvinceOrTerritory;
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });
    });

    describe('has to be a string', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          resettlementProvinceOrTerritory: 123 as any,
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isString');
      });
    });

    describe('has to have at least 1 character', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          resettlementProvinceOrTerritory: '',
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('minLength');
      });
    });

    describe('has to have at most 500 characters', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          resettlementProvinceOrTerritory: 'a'.repeat(501),
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('maxLength');
      });
    });
  });

  describe('stageOfResettlement', () => {
    describe('has to be defined', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          stageOfResettlement: '',
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });

      it('2nd version', async () => {
        const generateFirstQuestionDto = createValidDto();
        delete generateFirstQuestionDto.stageOfResettlement;
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });
    });

    describe('has to be a string', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          stageOfResettlement: 123 as any,
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isString');
      });
    });

    describe('has to have at least 1 character', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          stageOfResettlement: '',
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('minLength');
      });
    });

    describe('has to have at most 500 characters', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          stageOfResettlement: 'a'.repeat(501),
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('maxLength');
      });
    });
  });

  describe('resettlementCity', () => {
    describe('has to be defined', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          resettlementCity: '',
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });

      it('2nd version', async () => {
        const generateFirstQuestionDto = createValidDto();
        delete generateFirstQuestionDto.resettlementCity;
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });
    });

    describe('has to be a string', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          resettlementCity: 123 as any,
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isString');
      });
    });

    describe('has to have at least 1 character', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          resettlementCity: '',
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('minLength');
      });
    });

    describe('has to have at most 500 characters', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          resettlementCity: 'a'.repeat(501),
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('maxLength');
      });
    });
  });

  describe('currentCity', () => {
    describe('has to be defined', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          currentCity: '',
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });

      it('2nd version', async () => {
        const generateFirstQuestionDto = createValidDto();
        delete generateFirstQuestionDto.currentCity;
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });
    });

    describe('has to be a string', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          currentCity: 123 as any,
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isString');
      });
    });

    describe('has to have at least 1 character', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          currentCity: '',
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('minLength');
      });
    });

    describe('has to have at most 500 characters', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          currentCity: 'a'.repeat(501),
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('maxLength');
      });
    });
  });

  describe('currentCountry', () => {
    describe('has to be defined', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          currentCountry: '',
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });

      it('2nd version', async () => {
        const generateFirstQuestionDto = createValidDto();
        delete generateFirstQuestionDto.currentCountry;
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });
    });

    describe('has to be a string', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          currentCountry: 123 as any,
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isString');
      });
    });

    describe('has to have at least 1 character', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          currentCountry: '',
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('minLength');
      });
    });

    describe('has to have at most 500 characters', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          currentCountry: 'a'.repeat(501),
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('maxLength');
      });
    });
  });

  describe('currentProvinceOrTerritory', () => {
    describe('has to be defined', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          currentProvinceOrTerritory: '',
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });

      it('2nd version', async () => {
        const generateFirstQuestionDto = createValidDto();
        delete generateFirstQuestionDto.currentProvinceOrTerritory;
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });
    });

    describe('has to be a string', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          currentProvinceOrTerritory: 123 as any,
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isString');
      });
    });

    describe('has to have at least 1 character', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          currentProvinceOrTerritory: '',
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('minLength');
      });
    });

    describe('has to have at most 500 characters', () => {
      it('1st version', async () => {
        const generateFirstQuestionDto = createValidDto({
          currentProvinceOrTerritory: 'a'.repeat(501),
        });
        const dto = plainToInstance(
          GenerateFirstQuestionDto,
          generateFirstQuestionDto,
        );
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('maxLength');
      });
    });
  });
});
