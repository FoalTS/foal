// std
import { strictEqual } from 'assert';

// FoalTS
import { ApiRequestBody } from '../decorators';
import { IApiRequestBody } from '../interfaces';
import { getApiRequestBody } from './get-api-request-body';

describe('getApiRequestBody', () => {
  const requestBody: IApiRequestBody = {
    content: {}
  };

  describe('when a request body is specified, should return it', () => {

    it('from a class method.', () => {
      @ApiRequestBody(requestBody)
      class Controller {}

      const actual = getApiRequestBody(Controller);

      strictEqual(actual, requestBody);
    });

    it('from a class method.', () => {
      class Controller {
        @ApiRequestBody(requestBody)
        foo() {}
      }

      const actual = getApiRequestBody(Controller, 'foo');

      strictEqual(actual, requestBody);
    });

  });

  describe('when no request body is specified, should return undefined', () => {

    it('from a class.', () => {
      class Controller {}

      const actual = getApiRequestBody(Controller);

      strictEqual(actual, undefined);
    });

    it('from a class method.', () => {
      class Controller {
        foo() {}
      }

      const actual = getApiRequestBody(Controller, 'foo');

      strictEqual(actual, undefined);
    });

  });

});
