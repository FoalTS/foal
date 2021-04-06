// std
import { basename } from 'path';

// 3p
import { Config } from '@foal/core';

// FoalTS
import { WebsocketContext } from './websocket-context';
import { WebsocketErrorResponse } from './websocket-responses';

export function renderWebsocketError(error: Error, ctx: WebsocketContext): WebsocketErrorResponse {
  if (Config.get('settings.debug', 'boolean')) {
    const rex = /at (.*) \((.*):(\d+):(\d+)\)/;
    const [ , , path, line, column ] = Array.from(rex.exec(error.stack || '') || []);

    return new WebsocketErrorResponse({
      column: parseInt(column, 10),
      filename: basename(path),
      line: parseInt(line, 10),
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
  }

  return new WebsocketErrorResponse({ message: 'An internal server error has occurred.' });
}
