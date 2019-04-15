// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import { ApiInfo } from '../decorators';
import { IApiInfo } from '../interfaces';
import { getApiInfo } from './get-api-info';

describe('getApiInfo', () => {
  const info: IApiInfo = {
    title: 'api 1',
    version: '1.0.1'
  };

  describe('when an api information is defined, should return it', () => {

    it('from a class.', () => {
      @ApiInfo(info)
      class Controller {}

      const actual = getApiInfo(Controller);

      deepStrictEqual(actual, info);
    });

  });

  describe('when no api information is defined, should return undefined', () => {

    it('from a class.', () => {
      class Controller {}

      const actual = getApiInfo(Controller);

      strictEqual(actual, undefined);
    });

  });

});
