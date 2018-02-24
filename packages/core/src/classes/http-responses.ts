import { ObjectType } from '../interfaces';

export abstract class HttpResponse {
  public abstract statusCode: number;
  public abstract statusMessage: string;

  constructor(public content?: any) {}
}

/* 2xx Success */

export abstract class HttpResponseSuccess extends HttpResponse {
  constructor(content?: any) {
    super(content);
  }
}

export class HttpResponseOK extends HttpResponseSuccess {
  public statusCode = 200;
  public statusMessage = 'OK';
  constructor(content?: any) {
    super(content);
  }
}

export class HttpResponseCreated extends HttpResponseSuccess {
  public statusCode = 201;
  public statusMessage = 'CREATED';
  constructor(content?: any) {
    super(content);
  }
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
  constructor(content?: any) {
    super(content);
  }
}


export class HttpResponseBadRequest extends HttpResponseClientError {
  public statusCode = 400;
  public statusMessage = 'BAD REQUEST';
  constructor(content?: any) {
    super(content);
  }
}

export class HttpResponseUnauthorized extends HttpResponseClientError {
  public statusCode = 401;
  public statusMessage = 'UNAUTHORIZED';
  public headers = {
    'WWW-Authenticate': ''
  };
  constructor(content?: any) {
    super(content);
  }
}

export class HttpResponseForbidden extends HttpResponseClientError {
  public statusCode = 403;
  public statusMessage = 'FORBIDDEN';
  constructor(content?: any) {
    super(content);
  }
}

export class HttpResponseNotFound extends HttpResponseClientError {
  public statusCode = 404;
  public statusMessage = 'NOT FOUND';
  constructor(content?: any) {
    super(content);
  }
}

export class HttpResponseMethodNotAllowed extends HttpResponseClientError {
  public statusCode = 405;
  public statusMessage = 'METHOD NOT ALLOWED';
  constructor(content?: any) {
    super(content);
  }
}

export class HttpResponseConflict extends HttpResponseClientError {
  public statusCode = 409;
  public statusMessage = 'CONFLICT';
  constructor(content?: any) {
    super(content);
  }
}

/* 5xx Server Error */

export abstract class HttpResponseServerError extends HttpResponse {
  constructor(content?: any) {
    super(content);
  }
}

export class HttpResponseInternalServerError extends HttpResponseServerError {
  public statusCode = 500;
  public statusMessage = 'INTERNAL SERVER ERROR';
  constructor(content?: any) {
    super(content);
  }
}

export class HttpResponseNotImplemented extends HttpResponseServerError {
  public statusCode = 501;
  public statusMessage = 'NOT IMPLEMENTED';
  constructor(content?: any) {
    super(content);
  }
}
