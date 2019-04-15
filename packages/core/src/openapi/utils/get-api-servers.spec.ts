// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import { ApiServer } from '../decorators';
import { IApiServer } from '../interfaces';
import { getApiServers } from './get-api-servers';

describe('getApiServers', () => {
  const server: IApiServer = {
    url: 'http://example.com'
  };

  describe('when servers are defined, should return them', () => {

    it('from a class.', () => {
      @ApiServer(server)
      class Controller {}

      const actual = getApiServers(Controller);

      deepStrictEqual(actual, [ server ]);
    });

    it('from a class method.', () => {
      class Controller {
        @ApiServer(server)
        foo() {}
      }

      const actual = getApiServers(Controller, 'foo');

      deepStrictEqual(actual, [ server ]);
    });

  });

  describe('when no server is defined, should return undefined', () => {

    it('from a class.', () => {
      class Controller {}

      const actual = getApiServers(Controller);

      strictEqual(actual, undefined);
    });

    it('from a class method.', () => {
      class Controller {
        foo() {}
      }

      const actual = getApiServers(Controller, 'foo');

      strictEqual(actual, undefined);
    });

  });

});
