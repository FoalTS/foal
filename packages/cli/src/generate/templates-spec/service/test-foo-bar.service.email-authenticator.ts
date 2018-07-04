import { AbstractEmailAuthenticator, Service } from '@foal/core';

import { User } from 'somewhere';

@Service()
export class TestFooBar extends AbstractEmailAuthenticator<User> {
  UserModel = User;
}
