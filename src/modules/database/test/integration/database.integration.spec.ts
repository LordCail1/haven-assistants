import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../../services/database.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../../database.module';
import { Connection } from 'mongoose';

describe('DatabaseService', () => {
  let databaseService: DatabaseService;
  let dbConnection: Connection;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: `.env.${process.env.NODE_ENV}`, isGlobal: true }),
        DatabaseModule,
      ],
      providers: [DatabaseService],
    }).compile();

    databaseService = module.get<DatabaseService>(DatabaseService);
    dbConnection = databaseService.getDbHandle();
  });

  afterEach(async () => {
    dbConnection.close();
  });

  it('should be defined', () => {
    expect(databaseService).toBeDefined();
  });

  it('should return a database connection', async () => {
    const connection = databaseService.getDbHandle();
    expect(connection).toBeDefined();
    expect(typeof connection.close).toBe('function');
  });
});
