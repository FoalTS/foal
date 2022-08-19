export class InvalidTokenError extends Error {
  readonly isInvalidTokenError = true;
}

export function isInvalidTokenError(obj: any): obj is InvalidTokenError {
  return obj instanceof InvalidTokenError
   || (typeof obj === 'object' && obj !== null && obj.isInvalidTokenError === true);
}
