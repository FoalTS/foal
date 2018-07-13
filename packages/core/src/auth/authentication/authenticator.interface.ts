import { AbstractUser } from '../entities';

export interface IAuthenticator<User extends AbstractUser = AbstractUser> {
  authenticate(credentials: any): User | null | Promise<User|null>;
}
