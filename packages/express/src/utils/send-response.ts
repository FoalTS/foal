import {
  HttpResponse,
  HttpResponseRedirect,
  isHttpResponseClientError,
  isHttpResponseRedirect,
  isHttpResponseServerError,
  isHttpResponseSuccess,
} from '@foal/core';

export function sendResponse(res, response: HttpResponse) {
  if (isHttpResponseSuccess(response) || isHttpResponseClientError(response) || isHttpResponseServerError(response)) {
    if (typeof response.content === 'number') {
      response.content = response.content.toString();
    }
    res.status(response.statusCode).send(response.content);
  } else if (isHttpResponseRedirect(response)) {
    res.status(response.statusCode).redirect((response as HttpResponseRedirect).path);
  }
}
