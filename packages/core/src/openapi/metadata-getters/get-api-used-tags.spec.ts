// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import { ApiUseTag } from '../decorators';
import { getApiUsedTags } from './get-api-used-tags';

describe('getApiUsedTags', () => {

  describe('when tags are specified, should return them from', () => {

    it('from a class.', () => {
      @ApiUseTag('tag1')
      class Controller {}

      const actual = getApiUsedTags(Controller);

      deepStrictEqual(actual, [ 'tag1' ]);
    });

    it('from a class method.', () => {
      class Controller {
        @ApiUseTag('tag1')
        foo() {}
      }

      const actual = getApiUsedTags(Controller, 'foo');

      deepStrictEqual(actual, [ 'tag1' ]);
    });

  });

  describe('when no tag is specified, should return undefined from', () => {

    it('from a class.', () => {
      class Controller {}

      const actual = getApiUsedTags(Controller);

      strictEqual(actual, undefined);
    });

    it('from a class method.', () => {
      class Controller {
        foo() {}
      }

      const actual = getApiUsedTags(Controller, 'foo');

      strictEqual(actual, undefined);
    });

  });

});
