import { Config } from '@foal/core';

export function getSecretOrPublicKey(): Buffer|string {
  const secret = Config.get('settings.jwt.secret', 'string');
  if (secret) {
    const secretEncoding = Config.get('settings.jwt.secretEncoding', 'string');
    if (secretEncoding) {
      return Buffer.from(secret, secretEncoding as BufferEncoding|undefined);
    }
    return secret;
  }

  const publicKey = Config.get('settings.jwt.publicKey', 'string');
  if (publicKey) {
    return publicKey;
  }

  throw new Error(
    '[CONFIG] You must provide at least one of these configuration keys: '
    + 'settings.jwt.secret or settings.jwt.publicKey.'
  );
}
