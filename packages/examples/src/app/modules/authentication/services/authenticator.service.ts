import { EmailAndPasswordAuthenticatorService } from '@foal/authentication';
import { Service } from '@foal/core';

import { User } from '../../../models';

@Service()
export class AuthenticatorService extends EmailAndPasswordAuthenticatorService<User> {
  UserClass = User;

  constructor() {
    super();
  }
}
