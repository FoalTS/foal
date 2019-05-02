// std
import { strictEqual } from 'assert';

// FoalTS
import { ApiDeprecated } from '../decorators';
import { getApiDeprecated } from './get-api-deprecated';

describe('getApiDeprecated', () => {

  describe('when the deprecated flag is specified, should return it', () => {

    it('from a class.', () => {
      @ApiDeprecated()
      class Controller {}

      const actual = getApiDeprecated(Controller);

      strictEqual(actual, true);
    });

    it('from a class method.', () => {
      class Controller {
        @ApiDeprecated()
        foo() {}
      }

      const actual = getApiDeprecated(Controller, 'foo');

      strictEqual(actual, true);
    });

  });

  describe('when the deprecated flag is not specified, should return undefined', () => {

    it('from a class.', () => {
      class Controller {}

      const actual = getApiDeprecated(Controller);

      strictEqual(actual, undefined);
    });

    it('from a class method.', () => {
      class Controller {
        foo() {}
      }

      const actual = getApiDeprecated(Controller, 'foo');

      strictEqual(actual, undefined);
    });

  });

});
