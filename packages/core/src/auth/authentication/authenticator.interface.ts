import { AbstractUser } from '../models';

export interface IAuthenticator<User extends AbstractUser> {
  validate(credentials: any): any;
  authenticate(credentials: any): User | null | Promise<User|null>;
}
