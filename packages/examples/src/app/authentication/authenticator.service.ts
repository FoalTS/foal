import { EmailAuthenticatorService } from '@foal/authentication';
import { Service } from '@foal/core';

import { User, UserService } from '../shared';

@Service()
export class AuthenticatorService extends EmailAuthenticatorService<User> {
  constructor(userService: UserService) {
    super(userService);
  }
}
