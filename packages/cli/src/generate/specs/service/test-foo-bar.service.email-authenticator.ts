import { EmailAuthenticator, Service } from '@foal/core';

import { User } from '../entities';

@Service()
export class TestFooBar extends EmailAuthenticator<User> {
  entityClass = User;
}
