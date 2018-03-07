import {
  HttpResponse,
  HttpResponseClientError,
  HttpResponseRedirect,
  HttpResponseServerError,
  HttpResponseSuccess,
} from '@foal/core';

export function sendResponse(res, response: HttpResponse) {
  if (response instanceof HttpResponseSuccess || response instanceof HttpResponseClientError
      || response instanceof HttpResponseServerError) {
    if (typeof response.content === 'number') {
      response.content = response.content.toString();
    }
    res.status(response.statusCode).send(response.content);
  } else if (response instanceof HttpResponseRedirect) {
    res.status(response.statusCode).redirect(response.path);
  }
}
