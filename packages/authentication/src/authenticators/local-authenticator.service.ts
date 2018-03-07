import { IModelService, ObjectDoesNotExist } from '@foal/common';

import { IAuthenticator } from '../authenticator.interface';

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
    implements IAuthenticator<User> {

  constructor(protected userModelService: IModelService<User, any, any, any> & CheckPassword<User>) {}

  public async authenticate({ email, password }: { email: string, password: string }): Promise<User|null> {
    let user: User;

    try {
      user = await this.userModelService.findOne({ email });
    } catch (err) {
      if (err instanceof ObjectDoesNotExist) {
        return null;
      }
      throw err;
    }

    if (!this.userModelService.checkPassword(user, password)) {
      return null;
    }

    return user;
  }
}
