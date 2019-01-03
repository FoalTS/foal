import { EmailAuthenticator } from '@foal/typeorm';

import { User } from '../entities';

export class /* upperFirstCamelName */ extends EmailAuthenticator<User> {
  entityClass = User;
}
