import { Config, ConfigTypeError } from '@foal/core';
import { deepStrictEqual, strictEqual, throws } from 'assert';
import { getSecretOrPrivateKey } from './get-secret-or-private-key.util';

describe('getSecretOrPrivateKey', () => {

  context('given the config value settings.jwt.secret is defined', () => {

    const secret = 'secretX';

    beforeEach(() => Config.set('settings.jwt.secret', secret));

    afterEach(() => Config.remove('settings.jwt.secret'));

    it('should throw a ConfigTypeError if the value is not a string.', () => {
      Config.set('settings.jwt.secret', 2);

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

      beforeEach(() => Config.set('settings.jwt.secretEncoding', 'base64'));

      afterEach(() => Config.remove('settings.jwt.secretEncoding'));

      it('should throw a ConfigTypeError if the value is not a string.', () => {
        Config.set('settings.jwt.secretEncoding', 2);

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

    beforeEach(() => Config.set('settings.jwt.privateKey', privateKey));

    afterEach(() => Config.remove('settings.jwt.privateKey'));

    it('should throw a ConfigTypeError if the value is not a string.', () => {
      Config.set('settings.jwt.privateKey', 2);

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
