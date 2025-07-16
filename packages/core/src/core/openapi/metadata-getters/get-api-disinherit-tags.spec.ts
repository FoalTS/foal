// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import { ApiDisinheritTags } from '../decorators';
import { getApiDisinheritTags } from './get-api-disinherit-tags';

describe('getApiInfo', () => {


  describe('when an api information is defined, should return it', () => {

    it('from a class.', () => {
      @ApiDisinheritTags()
      class Controller { }

      const actual = getApiDisinheritTags(Controller);

      deepStrictEqual(actual, true);
    });

  });

  describe('when no api information is defined, should return undefined', () => {

    it('from a class.', () => {
      class Controller { }

      const actual = getApiDisinheritTags(Controller);

      strictEqual(actual, undefined);
    });

  });

});
