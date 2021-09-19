// std
import { strictEqual } from 'assert';
import { WebsocketContext } from './websocket-context';

// FoalTS
import { WebsocketErrorResponse, WebsocketResponse } from './websocket-responses';

describe('WebsocketResponse', () => {
  it('should accept a payload during instanciation and assign it as a property.', () => {
    const payload = {};
    const response = new WebsocketResponse(payload);

    strictEqual(response.payload, payload);
  });
});

describe('WebsocketErrorResponse', () => {

  it('should accept a payload during instanciation and assign it as a property.', () => {
    const payload = {};
    const response = new WebsocketErrorResponse(payload);

    strictEqual(response.payload, payload);
  });

  it('should accept an optional "error" option.', () => {
    let response = new WebsocketErrorResponse();
    strictEqual(response.error, undefined);

    const error = new Error('A random error.');
    response = new WebsocketErrorResponse({}, { error });
    strictEqual(response.error, error);
  });

  it('should accept an optional "ctx" option.', () => {
    let response = new WebsocketErrorResponse();
    strictEqual(response.ctx, undefined);

    const ctx = new WebsocketContext('foo event', {});
    response = new WebsocketErrorResponse({}, { ctx });
    strictEqual(response.ctx, ctx);
  });

});