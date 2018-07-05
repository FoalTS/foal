import { EmailAuthenticator, Service } from '@foal/core';

import { User } from 'somewhere';

@Service()
export class TestFooBar extends EmailAuthenticator<User> {
  UserModel = User;
}
