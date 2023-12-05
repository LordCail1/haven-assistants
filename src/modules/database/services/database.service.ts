import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { IDatabaseService } from '../interfaces/interfaces';

@Injectable()
export class DatabaseService implements IDatabaseService {
  /**
   * @param connection - The database connection.
   */
  constructor(@InjectConnection() private readonly connection: Connection) {}
  getDbHandle(): Connection {
    return this.connection;
  }
}
