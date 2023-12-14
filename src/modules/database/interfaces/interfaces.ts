import { Connection } from 'mongoose';
/**
 * This interface represents the database service.
 */
export interface IDatabaseService {
  /**
   * Gets the database handle
   * @returns The database connection
   */
  getDbHandle(): Connection;
}
