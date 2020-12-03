import { Context, Get, Hook, HttpResponse, HttpResponseForbidden, isHttpResponseInternalServerError, renderError } from '@foal/core';

class PermissionDenied extends Error {}

export class AppController {

  @Get('/products')
  @Hook(() => response => {
    // This line is not executed in version 1 but it is executed in version 2.
    (response as any).body += '!';
  })
  readProducts() {
    throw new PermissionDenied('Access forbidden');
  }

  handleError(error: Error, ctx: Context): HttpResponse|Promise<HttpResponse> {
    if (error instanceof PermissionDenied) {
      return new HttpResponseForbidden(error.message);
    }

    return renderError(error, ctx);
  }
}
