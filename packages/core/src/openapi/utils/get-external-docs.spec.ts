// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import { ApiExternalDoc } from '../decorators';
import { IApiExternalDocumentation } from '../interfaces';
import { getExternalDocs } from './get-external-docs';

describe('getExternalDocs', () => {
  const externalDocs: IApiExternalDocumentation = {
    url: 'http://www.example.com'
  };

  describe('when an externalDoc is defined, should return it from', () => {

    it('from a class.', () => {
      @ApiExternalDoc(externalDocs)
      class Controller {}

      const actual = getExternalDocs(Controller);

      deepStrictEqual(actual, externalDocs);
    });

    it('from a class method.', () => {
      class Controller {
        @ApiExternalDoc(externalDocs)
        foo() {}
      }

      const actual = getExternalDocs(Controller, 'foo');

      deepStrictEqual(actual, externalDocs);
    });

  });

  describe('when no tag is defined, should return undefined from', () => {

    it('from a class.', () => {
      class Controller {}

      const actual = getExternalDocs(Controller);

      strictEqual(actual, undefined);
    });

    it('from a class method.', () => {
      class Controller {
        foo() {}
      }

      const actual = getExternalDocs(Controller, 'foo');

      strictEqual(actual, undefined);
    });

  });

});
