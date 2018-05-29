import * as Ajv from 'ajv';
import { pbkdf2 } from 'crypto';
import { promisify } from 'util';

const ajv = new Ajv();

import {
  AbstractUser,
  Class,
  IAuthenticator,
  ValidationError
} from '@foal/core';
import { getManager, getRepository } from 'typeorm';

export interface EmailUser extends AbstractUser {
  email: string;
  password: string;
}

const schema = {
  additionalProperties: false,
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' }
  },
  required: [ 'email', 'password' ],
  type: 'object',
};

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
    const isValid = ajv.validate(schema, credentials);
    if (!isValid) {
      throw new ValidationError(ajv.errors);
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

    user = await getManager().findOne(this.UserClass, { where: { email } });
    if (!user) {
      return null;
    }

    if (!(await this.checkPassword(user, password))) {
      return null;
    }

    return user;
  }
}
