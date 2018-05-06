import {
  BaseUser,
  EmailAndPassword,
  emailAndPasswordSchema,
  parsePassword,
  UserModelService
} from '@foal/authentication';
import { Service } from '@foal/core';
import { ConnectionService } from './connection.service';

export type User = BaseUser & EmailAndPassword;

@Service()
export class UserService extends UserModelService<User> {
  constructor(connection: ConnectionService) {
    super(emailAndPasswordSchema, connection, [ parsePassword ]);
  }
}
