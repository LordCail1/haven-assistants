import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { UserDocument } from '../models/user.schema';

/**
 * User repository interface.
 * defines the methods to interact with database
 */
export interface IUserRepository {
  /**
   * Creates a user in the
   * @param user - user to create
   */
  create(user: User): Promise<UserDocument>;
}

/**
 * contract for Users service
 */
export interface IUsersService {
  /**
   * Creates a user
   * @param createUserDto - dto object to create a user
   */
  create(createUserDto: CreateUserDto): Promise<UserDocument>;
}
