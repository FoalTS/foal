// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import { WebsocketContext } from './websocket-context';

describe('WebsocketContext', () => {

  it('should instantiate with suitable properties.', () => {
    const eventName = 'create user';
    const payload = { id: 1 };
    const socket = { on: () => {} };

    const actual = new WebsocketContext(eventName, payload, socket);

    strictEqual(actual.eventName, eventName);
    strictEqual(actual.payload, payload);
    strictEqual(actual.socket, socket);
    deepStrictEqual(actual.state, {});
    strictEqual(actual.user, undefined);
    strictEqual(actual.session, null);
  });

});
