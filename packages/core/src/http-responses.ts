import { ObjectType } from './interfaces';

export abstract class HttpResponse {
  public abstract statusCode: number;
  public abstract statusMessage: string;

  constructor() {}
}

/* 3xx Redirection */

export class HttpResponseRedirect extends HttpResponse {
  public statusCode = 302;
  public statusMessage = 'FOUND';
  constructor(public path: string) {
    super();
  }
}

/* 4xx Client Error */

export abstract class HttpResponseClientError extends HttpResponse {
  constructor(public details?: ObjectType) {
    super();
  }
}


export class HttpResponseBadRequest extends HttpResponseClientError {
  public statusCode = 400;
  public statusMessage = 'BAD REQUEST';
  constructor(details?: ObjectType) {
    super(details);
  }
}

export class HttpResponseUnauthorized extends HttpResponseClientError {
  public statusCode = 401;
  public statusMessage = 'UNAUTHORIZED';
  public headers = {
    'WWW-Authenticate': ''
  };
  constructor(details?: ObjectType) {
    super(details);
  }
}

export class HttpResponseForbidden extends HttpResponseClientError {
  public statusCode = 403;
  public statusMessage = 'FORBIDDEN';
  constructor(details?: ObjectType) {
    super(details);
  }
}

export class HttpResponseNotFound extends HttpResponseClientError {
  public statusCode = 404;
  public statusMessage = 'NOT FOUND';
  constructor(details?: ObjectType) {
    super(details);
  }
}

export class HttpResponseMethodNotAllowed extends HttpResponseClientError {
  public statusCode = 405;
  public statusMessage = 'METHOD NOT ALLOWED';
  constructor(details?: ObjectType) {
    super(details);
  }
}

export class HttpResponseConflict extends HttpResponseClientError {
  public statusCode = 409;
  public statusMessage = 'CONFLICT';
  constructor(details?: ObjectType) {
    super(details);
  }
}

/* 5xx Server Error */

export abstract class HttpResponseServerError extends HttpResponse {
  constructor(public details?: ObjectType) {
    super();
  }
}

export class HttpResponseInternalServerError extends HttpResponseServerError {
  public statusCode = 500;
  public statusMessage = 'INTERNAL SERVER ERROR';
  constructor(details?: ObjectType) {
    super(details);
  }
}

export class HttpResponseNotImplemented extends HttpResponseServerError {
  public statusCode = 501;
  public statusMessage = 'NOT IMPLEMENTED';
  constructor(details?: ObjectType) {
    super(details);
  }
}
