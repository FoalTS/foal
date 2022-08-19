export class InvalidTokenError extends Error {
  isInvalidTokenError = true;
}

export function isInvalidTokenError(obj: any): obj is InvalidTokenError {
  return obj instanceof InvalidTokenError
   || (typeof obj === 'object' && obj !== null && obj.isInvalidTokenError === true);
}
