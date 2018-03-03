import {
  HttpResponse,
  HttpResponseRedirect,
  HttpResponseSuccess,
  HttpResponseClientError,
  HttpResponseServerError
} from '@foal/core';

export function sendResponse(res, response: HttpResponse) {
  if (response instanceof HttpResponseSuccess || response instanceof HttpResponseClientError
      || response instanceof HttpResponseServerError) {
    if (typeof response.content === 'number') {
      response.content = response.content.toString();
    }
    if (response.content) {
      res.status(response.statusCode).send(response.content);
    } else {
      res.sendStatus(response.statusCode);
    }
  }
  else if (response instanceof HttpResponseRedirect) {
    res.redirect(response.path);
  }
}
