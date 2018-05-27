import { Service } from '@foal/core';
import { AbstractEmailAuthenticator } from '@foal/password';

import { User } from '../../../models';

@Service()
export class AuthenticatorService extends AbstractEmailAuthenticator<User> {
  UserClass = User;
}
