// std
import { strictEqual } from 'assert';

// FoalTS
import { ApiOperationDescription } from '../decorators';
import { getApiOperationDescription } from './get-api-operation-description';

describe('getApiOperationDescription', () => {
  const description: string = 'hello';

  describe('when a operation summary is specified, should return it', () => {

    it('from a class method.', () => {
      @ApiOperationDescription(description)
      class Controller {}

      const actual = getApiOperationDescription(Controller);

      strictEqual(actual, description);
    });

    it('from a class method.', () => {
      class Controller {
        @ApiOperationDescription(description)
        foo() {}
      }

      const actual = getApiOperationDescription(Controller, 'foo');

      strictEqual(actual, description);
    });

  });

  describe('when no operation summary is specified, should return undefined', () => {

    it('from a class.', () => {
      class Controller {}

      const actual = getApiOperationDescription(Controller);

      strictEqual(actual, undefined);
    });

    it('from a class method.', () => {
      class Controller {
        foo() {}
      }

      const actual = getApiOperationDescription(Controller, 'foo');

      strictEqual(actual, undefined);
    });

  });

});
