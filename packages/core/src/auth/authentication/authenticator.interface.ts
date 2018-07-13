import { AbstractUser } from '../entities';

export interface IAuthenticator<User extends AbstractUser = AbstractUser> {
  validate(credentials: any): any;
  authenticate(credentials: any): User | null | Promise<User|null>;
}
