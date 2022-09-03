// std
import { deepStrictEqual, throws } from 'assert';

// FoalTS
import { decomposePbkdf2PasswordHash } from './decompose-pbkdf2-password-hash';

describe('decomposePbkdf2PasswordHash', () => {

  it('should throw an error if the password hash was NOT generated with PBKDF2.', () => {
    const passwordHash = 'foobar';

    throws(
      () => decomposePbkdf2PasswordHash(passwordHash),
      new Error('Invalid algorithm.')
    );
  });

  it('should throw an error if the digest algorithm is NOT SHA256.', () => {
    const passwordHash = 'pbkdf2_sha1';

    throws(
      () => decomposePbkdf2PasswordHash(passwordHash),
      new Error('Invalid algorithm.')
    );
  });

  it('should throw an error if no iterations is found.', () => {
    const passwordHash = 'pbkdf2_sha256';

    throws(
      () => decomposePbkdf2PasswordHash(passwordHash),
      new Error('Invalid password format.')
    );
  });

  it('should throw an error if the given iterations are NOT a number.', () => {
    const passwordHash = 'pbkdf2_sha256$foobar';

    throws(
      () => decomposePbkdf2PasswordHash(passwordHash),
      new Error('Invalid password format.')
    );
  });

  it('should throw an error if no salt is found.', () => {
    const passwordHash = 'pbkdf2_sha256$100000';

    throws(
      () => decomposePbkdf2PasswordHash(passwordHash),
      new Error('Invalid password format.')
    );
  });

  it('should throw an error if no derived key is found.', () => {
    const passwordHash = 'pbkdf2_sha256$100000$xxxx';

    throws(
      () => decomposePbkdf2PasswordHash(passwordHash),
      new Error('Invalid password format.')
    );
  });

  it('should return the derivedKey, the digest algorithm, the iterations, the salt and the key length.', () => {
    const digestAlgorithm = 'sha256';
    const iterations = 90000;
    const saltInBase64 = 'hello salt';
    const saltBuffer = Buffer.from(saltInBase64, 'base64');
    const derivedKeyInBase64 = 'hello derived key';
    const derivedKeyBuffer = Buffer.from(derivedKeyInBase64, 'base64');
    const keyLength = derivedKeyBuffer.length;

    const passwordHash = `pbkdf2_${digestAlgorithm}$${iterations}$${saltInBase64}$${derivedKeyInBase64}`;

    const actual = decomposePbkdf2PasswordHash(passwordHash);
    const expected: ReturnType<typeof decomposePbkdf2PasswordHash> = {
      derivedKey: derivedKeyBuffer,
      digestAlgorithm,
      iterations,
      keyLength,
      salt: saltBuffer,
    };

    deepStrictEqual(actual, expected);
  });

});
