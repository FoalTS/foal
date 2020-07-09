// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import { ApiDefineTag } from '../decorators';
import { IApiTag } from '../interfaces';
import { getApiTags } from './get-api-tags';

describe('getApiTags', () => {
  const tag: IApiTag = {
    name: 'tag 1'
  };

  describe('when tags are defined, should return them from', () => {

    it('from a class.', () => {
      @ApiDefineTag(tag)
      class Controller {}

      const actual = getApiTags(Controller);

      deepStrictEqual(actual, [ tag ]);
    });

    it('from a class method.', () => {
      class Controller {
        @ApiDefineTag(tag)
        foo() {}
      }

      const actual = getApiTags(Controller, 'foo');

      deepStrictEqual(actual, [ tag ]);
    });

  });

  describe('when no tag is defined, should return undefined from', () => {

    it('from a class.', () => {
      class Controller {}

      const actual = getApiTags(Controller);

      strictEqual(actual, undefined);
    });

    it('from a class method.', () => {
      class Controller {
        foo() {}
      }

      const actual = getApiTags(Controller, 'foo');

      strictEqual(actual, undefined);
    });

  });

});
