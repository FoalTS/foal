// std
import { strictEqual } from 'assert';

// FoalTS
import { ApiOperationId } from '../decorators';
import { getApiOperationId } from './get-api-operation-id';

describe('getApiOperationId', () => {
  const operationId: string = 'hello';

  describe('when a operation operationId is specified, should return it', () => {

    it('from a class method.', () => {
      @ApiOperationId(operationId)
      class Controller {}

      const actual = getApiOperationId(Controller);

      strictEqual(actual, operationId);
    });

    it('from a class method.', () => {
      class Controller {
        @ApiOperationId(operationId)
        foo() {}
      }

      const actual = getApiOperationId(Controller, 'foo');

      strictEqual(actual, operationId);
    });

  });

  describe('when no operation operationId is specified, should return undefined', () => {

    it('from a class.', () => {
      class Controller {}

      const actual = getApiOperationId(Controller);

      strictEqual(actual, undefined);
    });

    it('from a class method.', () => {
      class Controller {
        foo() {}
      }

      const actual = getApiOperationId(Controller, 'foo');

      strictEqual(actual, undefined);
    });

  });

});
