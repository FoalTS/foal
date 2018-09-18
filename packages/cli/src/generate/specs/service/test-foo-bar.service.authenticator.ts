import { IAuthenticator } from '@foal/core';

import { User } from '../entities';

export class TestFooBar implements IAuthenticator<User> {

  authenticate(credentials): User | null | Promise<User | null> {
    return null;
  }

}
