import { ConfigTypeError } from '@foal/core';
import { deepStrictEqual, strictEqual, throws } from 'assert';
import { getSecretOrPrivateKey } from './get-secret-or-private-key.util';

describe('getSecretOrPrivateKey', () => {

  context('given the config value settings.jwt.secret is defined', () => {

    const secret = 'secretX';

    beforeEach(() => process.env.SETTINGS_JWT_SECRET = secret);

    afterEach(() => delete process.env.SETTINGS_JWT_SECRET);

    xit('should throw a ConfigTypeError if the value is not a string.', () => {
      process.env.SETTINGS_JWT_SECRET = 2 as any;
      return throws(
        () => getSecretOrPrivateKey(),
        new ConfigTypeError('settings.jwt.secret', 'string', 'number'),
      );
    });

    context('given the config value settings.jwt.secretEncoding is not defined', () => {

      it('should return the secret.', () => {
        const actual = getSecretOrPrivateKey();
        strictEqual(actual, secret);
      });

    });

    context('given the config value settings.jwt.secretEncoding is defined', () => {

      const encoding = 'base64';

      beforeEach(() => process.env.SETTINGS_JWT_SECRET_ENCODING = 'base64');

      afterEach(() => delete process.env.SETTINGS_JWT_SECRET_ENCODING);

      xit('should throw a ConfigTypeError if the value is not a string.', () => {
        process.env.SETTINGS_JWT_SECRET_ENCODING = 2 as any;
        return throws(
          () => getSecretOrPrivateKey(),
          new ConfigTypeError('settings.jwt.secretEncoding', 'string', 'number'),
        );
      });

      it('should return the buffered secret.', () => {
        const actual = getSecretOrPrivateKey();
        if (typeof actual === 'string') {
          throw new Error('The returned value should be a buffer.');
        }

        deepStrictEqual(actual, Buffer.from(secret, encoding));
      });

    });

  });

  context('given the config value settings.jwt.privateKey is defined', () => {

    const privateKey = 'privateKeyX';

    beforeEach(() => process.env.SETTINGS_JWT_PRIVATE_KEY = privateKey);

    afterEach(() => delete process.env.SETTINGS_JWT_PRIVATE_KEY);

    xit('should throw a ConfigTypeError if the value is not a string.', () => {
      process.env.SETTINGS_JWT_PRIVATE_KEY = 2 as any;
      return throws(
        () => getSecretOrPrivateKey(),
        new ConfigTypeError('settings.jwt.privateKey', 'string', 'number'),
      );
    });

    it('should return the RSA private key.', () => {
      const actual = getSecretOrPrivateKey();
      strictEqual(actual, privateKey);
    });

  });

  context('given the two config values settings.jwt.secret and settings.jwt.privateKey not defined', () => {

    it('should throw an error.', () => {
      return throws(
        () => getSecretOrPrivateKey(),
        {
          message: '[CONFIG] You must provide at least one of these configuration keys: '
            + 'settings.jwt.secret or settings.jwt.privateKey.'
        }
      );
    });

  });

});
