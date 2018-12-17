import { UserWithPermissions } from '../entities';

export interface IAuthenticator<User extends UserWithPermissions = UserWithPermissions> {
  authenticate(credentials: any): User | null | Promise<User|null>;
}
