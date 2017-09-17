// Object.setPrototypeOf(this, MyErrorClass.prototype) must be added to each
// constructor.
// More docs at https://github.com/Microsoft/TypeScript-wiki/blob/master/
// Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work

export abstract class HttpError extends Error {
  public abstract statusCode: number;
  constructor() {
    super();
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

/* 4xx Client Error */

export abstract class ClientError extends HttpError {
  constructor() {
    super();
    Object.setPrototypeOf(this, ClientError.prototype);
  }
}

export class BadRequestError extends ClientError {
  public statusCode = 400;
  constructor() {
    super();
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export class UnauthorizedError extends ClientError {
  public statusCode = 401;
  constructor() {
    super();
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ForbiddenError extends ClientError {
  public statusCode = 403;
  constructor() {
    super();
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class NotFoundError extends ClientError {
  public statusCode = 404;
  constructor() {
    super();
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ConflictError extends ClientError {
  public statusCode = 409;
  constructor() {
    super();
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/* 5xx Server Error */

export abstract class ServerError extends HttpError {
  constructor() {
    super();
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

export class InternalServerError extends ServerError {
  public statusCode = 500;
  constructor() {
    super();
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

export class NotImplementedError extends ServerError {
  public statusCode = 501;
  constructor() {
    super();
    Object.setPrototypeOf(this, NotImplementedError.prototype);
  }
}
