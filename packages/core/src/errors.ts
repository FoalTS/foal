import { ObjectType } from './interfaces';

// Object.setPrototypeOf(this, MyErrorClass.prototype) must be added to each
// constructor.
// More docs at https://github.com/Microsoft/TypeScript-wiki/blob/master/
// Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work

export abstract class HttpError extends Error {
  public abstract statusCode: number;
  public abstract statusMessage: string;
  constructor(public details?: ObjectType) {
    super();
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

/* 4xx Client Error */

export abstract class ClientError extends HttpError {
  constructor(details?: ObjectType) {
    super(details);
    Object.setPrototypeOf(this, ClientError.prototype);
  }
}

export class BadRequestError extends ClientError {
  public statusCode = 400;
  public statusMessage = 'BAD REQUEST';
  constructor(details?: ObjectType) {
    super(details);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export class UnauthorizedError extends ClientError {
  public statusCode = 401;
  public statusMessage = 'UNAUTHORIZED';
  public headers = {
    'WWW-Authenticate': ''
  };
  constructor(details?: ObjectType) {
    super(details);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ForbiddenError extends ClientError {
  public statusCode = 403;
  public statusMessage = 'FORBIDDEN';
  constructor(details?: ObjectType) {
    super(details);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class NotFoundError extends ClientError {
  public statusCode = 404;
  public statusMessage = 'NOT FOUND';
  constructor(details?: ObjectType) {
    super(details);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class MethodNotAllowedError extends ClientError {
  public statusCode = 405;
  public statusMessage = 'METHOD NOT ALLOWED';
  constructor(details?: ObjectType) {
    super(details);
    Object.setPrototypeOf(this, MethodNotAllowedError.prototype);
  }
}

export class ConflictError extends ClientError {
  public statusCode = 409;
  public statusMessage = 'CONFLICT';
  constructor(details?: ObjectType) {
    super(details);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/* 5xx Server Error */

export abstract class ServerError extends HttpError {
  constructor(details?: ObjectType) {
    super(details);
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

export class InternalServerError extends ServerError {
  public statusCode = 500;
  public statusMessage = 'INTERNAL SERVER ERROR';
  constructor(details?: ObjectType) {
    super(details);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

export class NotImplementedError extends ServerError {
  public statusCode = 501;
  public statusMessage = 'NOT IMPLEMENTED';
  constructor(details?: ObjectType) {
    super(details);
    Object.setPrototypeOf(this, NotImplementedError.prototype);
  }
}
