// std
import { pipeline } from 'stream';

// FoalTS
import { HttpResponse, isHttpResponseMovedPermanently, isHttpResponseRedirect } from '../core';

/**
 * Convert a FoalTS response to an Express response.
 *
 * @export
 * @param {HttpResponse} response - FoalTS response.
 * @param {any} res - Express response used in middlewares.
 * @returns {void}
 */
export function sendResponse(
  response: HttpResponse,
  res: any,
  logger: {
    error: (message: string, params: { error: Error }) => void
  }
): void {
  res.status(response.statusCode);
  res.set(response.getHeaders());
  const cookies = response.getCookies();
  for (const cookieName in cookies) {
    const options = cookies[cookieName].options;
    if (options.maxAge !== undefined) {
      // Convert seconds to milliseconds to make it work with Express.
      options.maxAge = options.maxAge * 1000;
    }
    res.cookie(cookieName, cookies[cookieName].value, options);
  }

  if (isHttpResponseRedirect(response) || isHttpResponseMovedPermanently(response)) {
    res.redirect(response.statusCode, response.path);
    return;
  }

  if (typeof response.body === 'number') {
    response.body = response.body.toString();
  }

  if (response.stream === true) {
    pipeline(response.body, res, (error: any) => {
      if (error) {
        logger.error(error.message, { error });
      }
    });
    return;
  }

  res.send(response.body);
}
