import { Context, Hook, HookDecorator } from '../../core';

/**
 * Options of the `Log` hook.
 *
 * @export
 * @interface LogOptions
 */
export interface LogOptions {
  body?: boolean;
  params?: boolean;
  headers?: string[]|boolean;
  query?: boolean;
  logFn?: (message?: any, ...optionalParams: any[]) => void;
}

/**
 * Hook logging a message with optional information on the HTTP request.
 *
 * @param message The message to print.
 * @param options Options to specify which information on the HTTP request should be printed.
 */

/**
 * Hook factory logging a message with optional information on the HTTP request.
 *
 * @export
 * @param {string} message - The message to print on each request.
 * @param {LogOptions} [options={}] - Options to specify which information on the HTTP request should be printed.
 * @returns {HookDecorator} The hook.
 */
export function Log(message: string, options: LogOptions = {}): HookDecorator {
  const logFn = options.logFn || console.log;
  return Hook((ctx: Context) => {
    logFn(message);
    if (options.body) {
      logFn('Body: ', ctx.request.body);
    }
    if (options.params) {
      logFn('Params: ', ctx.request.params);
    }
    if (options.query) {
      logFn('Query: ', ctx.request.query);
    }
    if (options.headers === true) {
      logFn('Headers: ', ctx.request.headers);
    } else if (Array.isArray(options.headers)) {
      for (const header of options.headers) {
        const headerName = Object.keys(ctx.request.headers).find(
          head => header.toLowerCase() === head.toLowerCase() // Header names are case insensitive.
        );
        logFn(`${header}: `, headerName === undefined ? undefined : ctx.request.headers[headerName]);
      }
    }
  });
}
