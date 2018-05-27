import { AbstractUser } from '../models';

export interface IAuthenticator<User extends AbstractUser> {
  authenticate(credentials: any): User | null | Promise<User|null>;
}
