import { PASSWORD_ITERATIONS } from './hash-password';
import { decomposePbkdf2PasswordHash } from './utils';

export function passwordHashNeedsToBeRefreshed(passwordHash: string): boolean {
  const { iterations } = decomposePbkdf2PasswordHash(passwordHash);
  return iterations < PASSWORD_ITERATIONS;
}