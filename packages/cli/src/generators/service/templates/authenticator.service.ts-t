import { IAuthenticator, Service } from '@foal/core';

import { User } from 'somewhere';

@Service()
export class <%= CamelName %> implements IAuthenticator<User> {

  validate(credentials) {
    return credentials;
  }

  authenticate(credentials): User | null | Promise<User | null> {
    return null;
  }

}
