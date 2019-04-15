// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import { ApiParameter } from '../decorators';
import { IApiParameter } from '../interfaces';
import { getApiParameters } from './get-api-parameters';

describe('getApiParameters', () => {
  const param: IApiParameter = {
    in: 'cookie',
    name: 'foo'
  };

  describe('when parameters are specified, should return them', () => {

    it('from a class.', () => {
      @ApiParameter(param)
      class Controller {}

      const actual = getApiParameters(Controller);

      deepStrictEqual(actual, [ param ]);
    });

    it('from a class method.', () => {
      class Controller {
        @ApiParameter(param)
        foo() {}
      }

      const actual = getApiParameters(Controller, 'foo');

      deepStrictEqual(actual, [ param ]);
    });

  });

  describe('when no parameter is specified, should return undefined', () => {

    it('from a class.', () => {
      class Controller {}

      const actual = getApiParameters(Controller);

      strictEqual(actual, undefined);
    });

    it('from a class method.', () => {
      class Controller {
        foo() {}
      }

      const actual = getApiParameters(Controller, 'foo');

      strictEqual(actual, undefined);
    });

  });

});
