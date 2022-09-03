export function decomposePbkdf2PasswordHash(passwordHash: string): {
  digestAlgorithm: 'sha256',
  iterations: number,
  salt: Buffer,
  derivedKey: Buffer,
  keyLength: number,
} {
  const [ algorithm, iterationsAsString, saltInBase64, derivedKeyInBase64 ] = passwordHash.split('$');

  if (!algorithm.startsWith('pbkdf2_')) {
    throw new Error('Invalid algorithm.');
  }

  const digestAlgorithm = algorithm.split('pbkdf2_')[1];
  if (digestAlgorithm !== 'sha256') {
    throw new Error('Invalid algorithm.');
  }

  if (!iterationsAsString) {
    throw new Error('Invalid password format.');
  }

  const iterations = parseInt(iterationsAsString, 10);
  if (isNaN(iterations)) {
    throw new Error('Invalid password format.');
  }

  if (!saltInBase64) {
    throw new Error('Invalid password format.');
  }

  if (!derivedKeyInBase64) {
    throw new Error('Invalid password format.');
  }

  const derivedKey = Buffer.from(derivedKeyInBase64, 'base64');
  const salt = Buffer.from(saltInBase64, 'base64');

  return {
    digestAlgorithm,
    iterations,
    salt,
    derivedKey,
    keyLength: derivedKey.length,
  };
}