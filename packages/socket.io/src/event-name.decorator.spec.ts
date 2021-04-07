// std
import { strictEqual } from 'assert';

// 3p
import 'reflect-metadata';

// FoalTS
import { EventName } from './event-name.decorator';

describe('EventName', () => {

  it('should define the metadata websocket-event-name=${eventName} on the method class.', () => {
    class Foobar {
      @EventName('foo')
      barfoo() {}
    }

    const actual = Reflect.getOwnMetadata('websocket-event-name', Foobar.prototype, 'barfoo');
    strictEqual(actual, 'foo');
  });

});