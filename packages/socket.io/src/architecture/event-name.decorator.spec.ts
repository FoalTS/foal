// std
import { strictEqual, throws } from 'assert';

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

  it('should throw an error if the event name is empty.', () => {
    throws(
      () => {
        // tslint:disable-next-line:no-unused-variable
        class Foobar {
          @EventName('')
          barfoo() {}
        }
      },
      new Error('@EventName does not support empty names.')
    );
  });

});