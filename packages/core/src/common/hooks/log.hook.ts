import { Context, Hook, HookDecorator } from '../../core';

export interface LogOptions {
  body?: boolean;
  params?: boolean;
  headers?: string[]|boolean;
  query?: boolean;
  logFn?: (message?: any, ...optionalParams: any[]) => void;
}

/**
 * Logs a message with optional information on the HTTP request.
 *
 * @param message The message to print.
 * @param options Options to specify which information on the HTTP request should be printed.
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
      options.headers.forEach(header => logFn(`${header}: `, ctx.request.headers[header]));
    }
  });
}
