// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import { ApiCallback } from '../decorators';
import { IApiCallback } from '../interfaces';
import { getApiCallbacks } from './get-api-callbacks';

describe('getApiCallbacks', () => {
  const callback: IApiCallback = {};

  describe('when callbacks are specified, should return them', () => {

    it('from a class.', () => {
      @ApiCallback('callback1', callback)
      class Controller {}

      const actual = getApiCallbacks(Controller);

      deepStrictEqual(actual, { callback1: callback });
    });

    it('from a class method.', () => {
      class Controller {
        @ApiCallback('callback1', callback)
        foo() {}
      }

      const actual = getApiCallbacks(Controller, 'foo');

      deepStrictEqual(actual, { callback1: callback });
    });

  });

  describe('when no callback is specified, should return undefined', () => {

    it('from a class.', () => {
      class Controller {}

      const actual = getApiCallbacks(Controller);

      strictEqual(actual, undefined);
    });

    it('from a class method.', () => {
      class Controller {
        foo() {}
      }

      const actual = getApiCallbacks(Controller, 'foo');

      strictEqual(actual, undefined);
    });

  });

});
