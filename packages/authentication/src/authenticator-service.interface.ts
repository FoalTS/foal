import { ObjectType } from '@foal/core';

export interface AuthenticatorService<User> {
  authenticate(credentials: ObjectType): User | null | Promise<User|null>;
}
