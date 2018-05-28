export class ValidationError extends Error {
  readonly isValidationError = true;

  constructor() {
    super();
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export function isValidationError(err: object): boolean {
  return err instanceof ValidationError || (err as any).isValidationError === true;
}
