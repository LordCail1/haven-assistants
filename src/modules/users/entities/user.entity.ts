/**
 * User entity
 */
export class User {
  private email: string;
  /**
   * gets the email of the user
   * @returns email
   */
  getEmail(): string {
    return this.email;
  }

  /**
   * sets the Email of the user
   * @param email - email to set
   */
  setEmail(email: string): void {
    this.email = email;
  }
}
