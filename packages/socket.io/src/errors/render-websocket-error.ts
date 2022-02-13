// std
import { basename } from 'path';

// 3p
import { Config } from '@foal/core';

// FoalTS
import { WebsocketContext, WebsocketErrorResponse } from '../architecture';

export function renderWebsocketError(error: Error, ctx: WebsocketContext): WebsocketErrorResponse {
  if (Config.get('settings.debug', 'boolean')) {
    const rex = /at (.*) \((.*):(\d+):(\d+)\)/;
    const [ , , path, line, column ] = Array.from(rex.exec(error.stack || '') || []);

    return new WebsocketErrorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      column: parseInt(column, 10),
      filename: basename(path || ''),
      line: parseInt(line, 10),
      message: error.message,
      name: error.name,
      stack: error.stack,
    }, { ctx, error });
  }

  return new WebsocketErrorResponse({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An internal server error has occurred.'
  }, { ctx, error });
}
