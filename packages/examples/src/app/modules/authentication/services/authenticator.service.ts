import { AbstractEmailAuthenticator, Service } from '@foal/core';

import { User } from '../../../models';

@Service()
export class Authenticator extends AbstractEmailAuthenticator<User> {
  UserModel = User;
}
