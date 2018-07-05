import { EmailAuthenticator, Service } from '@foal/core';

import { User } from '../../../models';

@Service()
export class Authenticator extends EmailAuthenticator<User> {
  UserModel = User;
}
