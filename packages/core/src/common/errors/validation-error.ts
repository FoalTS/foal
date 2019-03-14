/**
 * Represent an incorrect data format.
 *
 * @export
 * @class ValidationError
 * @extends {Error}
 */
export class ValidationError extends Error {
  readonly isValidationError = true;

  constructor(public content?: any) {
    super();
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Check if an error is an instance of ValidationError.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {object} err - The error to check
 * @returns {err is ValidationError} True if the error is an instance of ValidationError. False otherwise.
 */
export function isValidationError(err: object): err is ValidationError {
  return err instanceof ValidationError || (err as any).isValidationError === true;
}
