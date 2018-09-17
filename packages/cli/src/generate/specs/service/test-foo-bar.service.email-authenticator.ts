import { EmailAuthenticator } from '@foal/core';

import { User } from '../entities';

export class TestFooBar extends EmailAuthenticator<User> {
  entityClass = User;
}
