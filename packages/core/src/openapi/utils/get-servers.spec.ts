// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import { ApiServer } from '../decorators';
import { IApiServer } from '../interfaces';
import { getServers } from './get-servers';

describe('getServers', () => {
  const server: IApiServer = {
    url: 'http://example.com'
  };

  describe('when servers are defined, should return them', () => {

    it('from a class.', () => {
      @ApiServer(server)
      class Controller {}

      const actual = getServers(Controller);

      deepStrictEqual(actual, [ server ]);
    });

    it('from a class method.', () => {
      class Controller {
        @ApiServer(server)
        foo() {}
      }

      const actual = getServers(Controller, 'foo');

      deepStrictEqual(actual, [ server ]);
    });

  });

  describe('when no server is defined, should return undefined', () => {

    it('from a class.', () => {
      class Controller {}

      const actual = getServers(Controller);

      strictEqual(actual, undefined);
    });

    it('from a class method.', () => {
      class Controller {
        foo() {}
      }

      const actual = getServers(Controller, 'foo');

      strictEqual(actual, undefined);
    });

  });

});
