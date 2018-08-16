export class ValidationError extends Error {
  readonly isValidationError = true;

  constructor(public content?: any) {
    super();
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export function isValidationError(err: object): err is ValidationError {
  return err instanceof ValidationError || (err as any).isValidationError === true;
}
