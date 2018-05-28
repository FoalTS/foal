import { pbkdf2 } from 'crypto';
import { promisify } from 'util';

import {
  AbstractUser,
  Class,
  IAuthenticator,
  IModelService,
  isObjectDoesNotExist,
  ValidationError
} from '@foal/core';
import { getManager } from 'typeorm';

export interface EmailUser extends AbstractUser {
  email: string;
  password: string;
}

/**
 * Authenticator with email and password. A user model service should be passed to the constructor.
 *
 * @export
 * @abstract
 * @class AbstractEmailAuthenticator
 * @implements {IAuthenticator<User>}
 * @template User An user interface that includes an `email` and a `password` fields.
 */
export abstract class AbstractEmailAuthenticator<User extends EmailUser>
    implements IAuthenticator<User> {

  abstract UserClass: Class<User>;

  validate(credentials: any): { email: string, password: string } {
    if (typeof credentials !== 'object' || credentials === null) {
      throw new ValidationError({ message: 'Credentials should be an object.' });
    }
    if (!credentials.hasOwnProperty('email') || typeof credentials.username !== 'string') {
      throw new ValidationError({
        message: 'Credentials should has a correct username property.'
      });
    }
    if (!credentials.hasOwnProperty('password') || typeof credentials.password !== 'string') {
      throw new ValidationError({
        message: 'Credentials should has a correct password property.'
      });
    }
    return { email: credentials.email, password: credentials.password };
  }

  async checkPassword(user: User, password: string): Promise<boolean> {
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

  async authenticate({ email, password }: { email: string, password: string }): Promise<User|null> {
    let user: User|undefined;

    user = await getManager().findOne(this.UserClass, { email, password } as any);
    if (!user) {
      return null;
    }

    if (!(await this.checkPassword(user, password))) {
      return null;
    }

    return user;
  }
}
