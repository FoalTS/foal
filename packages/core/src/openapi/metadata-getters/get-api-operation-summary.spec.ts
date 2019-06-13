// std
import { strictEqual } from 'assert';

// FoalTS
import { ApiOperationSummary } from '../decorators';
import { getApiOperationSummary } from './get-api-operation-summary';

describe('getApiOperationSummary', () => {
  const summary: string = 'hello';

  describe('when a operation summary is specified, should return it', () => {

    it('from a class method.', () => {
      @ApiOperationSummary(summary)
      class Controller {}

      const actual = getApiOperationSummary(Controller);

      strictEqual(actual, summary);
    });

    it('from a class method.', () => {
      class Controller {
        @ApiOperationSummary(summary)
        foo() {}
      }

      const actual = getApiOperationSummary(Controller, 'foo');

      strictEqual(actual, summary);
    });

  });

  describe('when no operation summary is specified, should return undefined', () => {

    it('from a class.', () => {
      class Controller {}

      const actual = getApiOperationSummary(Controller);

      strictEqual(actual, undefined);
    });

    it('from a class method.', () => {
      class Controller {
        foo() {}
      }

      const actual = getApiOperationSummary(Controller, 'foo');

      strictEqual(actual, undefined);
    });

  });

});
