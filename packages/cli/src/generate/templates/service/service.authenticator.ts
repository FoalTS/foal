import { IAuthenticator, Service } from '@foal/core';

import { User } from 'somewhere';

@Service()
export class /* upperFirstCamelName */ implements IAuthenticator<User> {

  authenticate(credentials): User | null | Promise<User | null> {
    return null;
  }

}
