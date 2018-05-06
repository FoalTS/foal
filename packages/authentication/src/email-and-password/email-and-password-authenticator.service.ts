import { pbkdf2 } from 'crypto';
import { promisify } from 'util';

import { IModelService, isObjectDoesNotExist } from '@foal/common';

import { IAuthenticator } from '../authenticator.interface';

/**
 * Authenticator with email and password. A user model service should be passed to the constructor.
 *
 * @export
 * @abstract
 * @class EmailAndPasswordAuthenticatorService
 * @implements {IAuthenticator<User>}
 * @template User An user interface that includes an `email` and a `password` fields.
 */
export abstract class EmailAndPasswordAuthenticatorService<User extends { email: string, password: string }>
    implements IAuthenticator<User> {

  constructor(protected userModelService: IModelService<User, any, any, any>) {}

  public async checkPassword(user: User, password: string): Promise<boolean> {
    if (!(user.password.startsWith('pbkdf2_'))) {
      throw new Error('Password format is incorrect or not supported.');
    }
    const arr = user.password.slice(7).split('$');
    if (arr.length !== 4) {
      throw new Error('Password format is incorrect (pbkdf2).');
    }
    const digest = arr[0];
    const iterations = parseInt(arr[1], 10);
    const salt = arr[2];
    const keylen = 64;
    const derivedKey = arr[3];
    return derivedKey === (await promisify(pbkdf2)(password, salt, iterations, keylen, digest)).toString('hex');
  }

  public async authenticate({ email, password }: { email: string, password: string }): Promise<User|null> {
    let user: User;

    try {
      user = await this.userModelService.findOne({ email });
    } catch (err) {
      if (isObjectDoesNotExist(err)) {
        return null;
      }
      throw err;
    }

    if (!(await this.checkPassword(user, password))) {
      return null;
    }

    return user;
  }
}
