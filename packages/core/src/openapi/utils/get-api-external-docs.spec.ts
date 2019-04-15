// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import { ApiExternalDoc } from '../decorators';
import { IApiExternalDocumentation } from '../interfaces';
import { getApiExternalDocs } from './get-api-external-docs';

describe('getApiExternalDocs', () => {
  const externalDocs: IApiExternalDocumentation = {
    url: 'http://www.example.com'
  };

  describe('when an external documentation is defined, should return it', () => {

    it('from a class.', () => {
      @ApiExternalDoc(externalDocs)
      class Controller {}

      const actual = getApiExternalDocs(Controller);

      deepStrictEqual(actual, externalDocs);
    });

    it('from a class method.', () => {
      class Controller {
        @ApiExternalDoc(externalDocs)
        foo() {}
      }

      const actual = getApiExternalDocs(Controller, 'foo');

      deepStrictEqual(actual, externalDocs);
    });

  });

  describe('when no external documentation is defined, should return undefined', () => {

    it('from a class.', () => {
      class Controller {}

      const actual = getApiExternalDocs(Controller);

      strictEqual(actual, undefined);
    });

    it('from a class method.', () => {
      class Controller {
        foo() {}
      }

      const actual = getApiExternalDocs(Controller, 'foo');

      strictEqual(actual, undefined);
    });

  });

});
