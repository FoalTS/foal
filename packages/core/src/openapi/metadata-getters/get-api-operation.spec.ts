// std
import { strictEqual } from 'assert';

// FoalTS
import { ApiOperation } from '../decorators';
import { IApiOperation } from '../interfaces';
import { getApiOperation } from './get-api-operation';

describe('getApiOperation', () => {
  const operation: IApiOperation = {
    responses: {}
  };

  describe('when an operation is specified, should return it', () => {

    it('from a class.', () => {
      @ApiOperation(operation)
      class Controller {}

      const actual = getApiOperation(Controller);

      strictEqual(actual, operation);
    });

    it('from a class method.', () => {
      class Controller {
        @ApiOperation(operation)
        foo() {}
      }

      const actual = getApiOperation(Controller, 'foo');

      strictEqual(actual, operation);
    });

  });

  describe('when no operation is specified, should return undefined', () => {

    it('from a class.', () => {
      class Controller {}

      const actual = getApiOperation(Controller);

      strictEqual(actual, undefined);
    });
    it('from a class method.', () => {
      class Controller {
        foo() {}
      }

      const actual = getApiOperation(Controller, 'foo');

      strictEqual(actual, undefined);
    });

  });

});
