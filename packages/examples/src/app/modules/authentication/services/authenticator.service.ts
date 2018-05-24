import { EmailAndPasswordAuthenticatorService } from '@foal/authentication';
import { Service } from '@foal/core';

import { User } from '../../../services';

@Service()
export class AuthenticatorService extends EmailAndPasswordAuthenticatorService<User> {
  ModelClass = User;
}
