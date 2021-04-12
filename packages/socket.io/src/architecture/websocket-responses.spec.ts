// std
import { strictEqual } from 'assert';

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
});