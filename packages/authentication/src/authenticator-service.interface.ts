import { ObjectType } from '@foal/core';

export interface AuthenticatorService<User> {
  authenticate(credentials: ObjectType): User | Promise<User>;
}
