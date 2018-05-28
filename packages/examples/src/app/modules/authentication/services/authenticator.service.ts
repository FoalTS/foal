import { Service } from '@foal/core';
import { AbstractEmailAuthenticator } from '@foal/password';

import { User } from '../../../models';

@Service()
export class Authenticator extends AbstractEmailAuthenticator<User> {
  UserClass = User;
}
