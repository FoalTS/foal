// std
import { strictEqual } from 'assert';

// FoalTS
import { getMetadata } from '@foal/core';

// FoalTS
import { wsController } from './ws-controller';

describe('wsController util', () => {

  it('should return the given controller class.', () => {
    class Foobar {}

    strictEqual(wsController('', Foobar), Foobar);
  });

  it('should define the metadata path={path} of the controller class.', () => {
    class Foobar {}

    wsController('foo', Foobar);

    strictEqual(getMetadata('websocket-event-name', Foobar), 'foo');
  });

});
