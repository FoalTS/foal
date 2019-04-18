// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import { ApiResponse } from '../decorators';
import { IApiResponse } from '../interfaces';
import { getApiResponses } from './get-api-responses';

describe('getApiResponses', () => {
  const response: IApiResponse = {
    description: 'response 1'
  };

  describe('when responses are specified, should return them', () => {

    it('from a class.', () => {
      @ApiResponse(200, response)
      class Controller {}

      const actual = getApiResponses(Controller);

      deepStrictEqual(actual, { 200: response });
    });

    it('from a class method.', () => {
      class Controller {
        @ApiResponse(200, response)
        foo() {}
      }

      const actual = getApiResponses(Controller, 'foo');

      deepStrictEqual(actual, { 200: response });
    });

  });

  describe('when no response is specified, should return undefined', () => {

    it('from a class.', () => {
      class Controller {}

      const actual = getApiResponses(Controller);

      strictEqual(actual, undefined);
    });

    it('from a class method.', () => {
      class Controller {
        foo() {}
      }

      const actual = getApiResponses(Controller, 'foo');

      strictEqual(actual, undefined);
    });

  });

});
