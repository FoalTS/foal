import { ModelService } from '@foal/common';
import { NotFoundError, ObjectType, UnauthorizedError } from '@foal/core';

import { AuthenticatorService } from '../authenticator-service.interface';

export interface CheckPassword<User> {
  checkPassword(user: User, password: string): boolean;
}

/**
 * Authenticator with email and password. A user model service that includes a `checkPassword` method
 * should be passed to the constructor.
 *
 * @export
 * @abstract
 * @class LocalAuthenticatorService
 * @implements {AuthenticatorService<User>}
 * @template User An user interface that includes an `email` and a `password` fields.
 */
export abstract class LocalAuthenticatorService<User extends { email: string, password: string }>
    implements AuthenticatorService<User> {

  constructor(protected userModelService: ModelService<User, ObjectType, ObjectType, any> & CheckPassword<User>) {}

  public async authenticate({ email, password }: { email: string, password: string }): Promise<User> {
    let user: User;

    try {
      user = await this.userModelService.findOne({ email });
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new UnauthorizedError({ message: 'Incorrect email or password.' });
      } else {
        throw err;
      }
    }

    if (!this.userModelService.checkPassword(user, password)) {
      throw new UnauthorizedError({ message: 'Incorrect email or password.' });
    }

    return user;
  }
}
