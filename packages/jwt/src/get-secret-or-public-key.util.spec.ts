import { Config, ConfigTypeError } from '@foal/core';
import { deepStrictEqual, strictEqual, throws } from 'assert';
import { getSecretOrPublicKey } from './get-secret-or-public-key.util';

describe('getSecretOrPublicKey', () => {

  context('given the config value settings.jwt.secret is defined', () => {

    const secret = 'secretX';

    beforeEach(() => Config.set('settings.jwt.secret', secret));

    afterEach(() => Config.remove('settings.jwt.secret'));

    it('should throw a ConfigTypeError if the value is not a string.', () => {
      Config.set('settings.jwt.secret', 2);

      return throws(
        () => getSecretOrPublicKey(),
        new ConfigTypeError('settings.jwt.secret', 'string', 'number'),
      );
    });

    context('given the config value settings.jwt.secretEncoding is not defined', () => {

      it('should return the secret.', () => {
        const actual = getSecretOrPublicKey();
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
          () => getSecretOrPublicKey(),
          new ConfigTypeError('settings.jwt.secretEncoding', 'string', 'number'),
        );
      });

      it('should return the buffered secret.', () => {
        const actual = getSecretOrPublicKey();
        if (typeof actual === 'string') {
          throw new Error('The returned value should be a buffer.');
        }

        deepStrictEqual(actual, Buffer.from(secret, encoding));
      });

    });

  });

  context('given the config value settings.jwt.publicKey is defined', () => {

    const publicKey = 'publicKeyX';

    beforeEach(() => Config.set('settings.jwt.publicKey', publicKey));

    afterEach(() => Config.remove('settings.jwt.publicKey'));

    it('should throw a ConfigTypeError if the value is not a string.', () => {
      Config.set('settings.jwt.publicKey', 2);

      return throws(
        () => getSecretOrPublicKey(),
        new ConfigTypeError('settings.jwt.publicKey', 'string', 'number'),
      );
    });

    it('should return the RSA public key.', () => {
      const actual = getSecretOrPublicKey();
      strictEqual(actual, publicKey);
    });

  });

  context('given the two config values settings.jwt.secret and settings.jwt.publicKey not defined', () => {

    it('should throw an error.', () => {
      return throws(
        () => getSecretOrPublicKey(),
        {
          message: '[CONFIG] You must provide at least one of these configuration keys: '
            + 'settings.jwt.secret or settings.jwt.publicKey.'
        }
      );
    });

  });

});
