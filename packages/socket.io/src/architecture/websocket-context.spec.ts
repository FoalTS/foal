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
    strictEqual(actual.user, null);
    strictEqual(actual.session, null);
    strictEqual(actual.messageId, null);
    strictEqual(actual.controllerName, '');
    strictEqual(actual.controllerMethodName, '');

    const actual2 = new WebsocketContext(eventName, payload, socket, 'AppController', 'foobar');
    strictEqual(actual2.controllerName, 'AppController');
    strictEqual(actual2.controllerMethodName, 'foobar');
  });

});
