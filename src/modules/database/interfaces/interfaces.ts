import { Connection } from 'mongoose';

export interface IDatabaseService {
  /**
   * Gets the database handle
   * @returns The database connection
   */
  getDbHandle(): Connection;
}
