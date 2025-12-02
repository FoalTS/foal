import { PasswordService } from './password.service';

/**
 * Check if a password hash needs to be refreshed.
 *
 * @deprecated Use `PasswordService.passwordHashNeedsToBeRefreshed()` instead.
 * @param {string} passwordHash - The password hash to check.
 * @returns {boolean} True if the password hash needs to be refreshed. False otherwise.
 */
export function passwordHashNeedsToBeRefreshed(passwordHash: string): boolean {
  const service = new PasswordService();
  return service.passwordHashNeedsToBeRefreshed(passwordHash);
}