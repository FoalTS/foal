import { deepStrictEqual } from 'assert';
import {
  ApiDefineCallback, ApiDefineExample, ApiDefineHeader, ApiDefineLink, ApiDefineParameter,
  ApiDefineRequestBody, ApiDefineResponse, ApiDefineSchema, ApiDefineSecurityScheme
} from '../decorators';
import {
  IApiCallback, IApiComponents, IApiExample, IApiHeader, IApiLink, IApiParameter,
  IApiRequestBody, IApiResponse, IApiSchema, IApiSecurityScheme
} from '../interfaces';
import { getComponents } from './get-components';

describe('getComponents', () => {

  const callback: IApiCallback = {};
  const example: IApiExample = {};
  const header: IApiHeader = {};
  const link: IApiLink = {};
  const parameter: IApiParameter = {
    in: 'cookie',
    name: 'foo'
  };
  const requestBody: IApiRequestBody = {
    content: {}
  };
  const response: IApiResponse = {
    description: 'foo'
  };
  const schema: IApiSchema = {};
  const securityScheme: IApiSecurityScheme = {
    in: 'cookie',
    name: 'foo',
    type: 'apiKey',
  };

  describe('should return the callbacks of', () => {

    it('a class.', () => {
      @ApiDefineCallback('callback', callback)
      class Controller {}

      const actual = getComponents(Controller);

      deepStrictEqual(actual, {
        callbacks: { callback }
      } as IApiComponents);
    });

    it('a class method.', () => {
      class Controller {
        @ApiDefineCallback('callback', callback)
        foo() {}
      }

      const actual = getComponents(Controller, 'foo');

      deepStrictEqual(actual, {
        callbacks: { callback }
      } as IApiComponents);
    });

  });

  describe('should return the examples of', () => {

    it('a class.', () => {
      @ApiDefineExample('example', example)
      class Controller {}

      const actual = getComponents(Controller);

      deepStrictEqual(actual, {
        examples: { example }
      } as IApiComponents);
    });

    it('a class method.', () => {
      class Controller {
        @ApiDefineExample('example', example)
        foo() {}
      }

      const actual = getComponents(Controller, 'foo');

      deepStrictEqual(actual, {
        examples: { example }
      } as IApiComponents);
    });

  });

  describe('should return the headers of', () => {

    it('a class.', () => {
      @ApiDefineHeader('header', header)
      class Controller {}

      const actual = getComponents(Controller);

      deepStrictEqual(actual, {
        headers: { header }
      } as IApiComponents);
    });

    it('a class method.', () => {
      class Controller {
        @ApiDefineHeader('header', header)
        foo() {}
      }

      const actual = getComponents(Controller, 'foo');

      deepStrictEqual(actual, {
        headers: { header }
      } as IApiComponents);
    });

  });

  describe('should return the links of', () => {

    it('a class.', () => {
      @ApiDefineLink('link', link)
      class Controller {}

      const actual = getComponents(Controller);

      deepStrictEqual(actual, {
        links: { link }
      } as IApiComponents);
    });

    it('a class method.', () => {
      class Controller {
        @ApiDefineLink('link', link)
        foo() {}
      }

      const actual = getComponents(Controller, 'foo');

      deepStrictEqual(actual, {
        links: { link }
      } as IApiComponents);
    });

  });

  describe('should return the parameters of', () => {

    it('a class.', () => {
      @ApiDefineParameter('parameter', parameter)
      class Controller {}

      const actual = getComponents(Controller);

      deepStrictEqual(actual, {
        parameters: { parameter }
      } as IApiComponents);
    });

    it('a class method.', () => {
      class Controller {
        @ApiDefineParameter('parameter', parameter)
        foo() {}
      }

      const actual = getComponents(Controller, 'foo');

      deepStrictEqual(actual, {
        parameters: { parameter }
      } as IApiComponents);
    });

  });

  describe('should return the requestBodies of', () => {

    it('a class.', () => {
      @ApiDefineRequestBody('requestBody', requestBody)
      class Controller {}

      const actual = getComponents(Controller);

      deepStrictEqual(actual, {
        requestBodies: { requestBody }
      } as IApiComponents);
    });

    it('a class method.', () => {
      class Controller {
        @ApiDefineRequestBody('requestBody', requestBody)
        foo() {}
      }

      const actual = getComponents(Controller, 'foo');

      deepStrictEqual(actual, {
        requestBodies: { requestBody }
      } as IApiComponents);
    });

  });

  describe('should return the responses of', () => {

    it('a class.', () => {
      @ApiDefineResponse('response', response)
      class Controller {}

      const actual = getComponents(Controller);

      deepStrictEqual(actual, {
        responses: { response }
      } as IApiComponents);
    });

    it('a class method.', () => {
      class Controller {
        @ApiDefineResponse('response', response)
        foo() {}
      }

      const actual = getComponents(Controller, 'foo');

      deepStrictEqual(actual, {
        responses: { response }
      } as IApiComponents);
    });

  });

  describe('should return the schemas of', () => {

    it('a class.', () => {
      @ApiDefineSchema('schema', schema)
      class Controller {}

      const actual = getComponents(Controller);

      deepStrictEqual(actual, {
        schemas: { schema }
      } as IApiComponents);
    });

    it('a class method.', () => {
      class Controller {
        @ApiDefineSchema('schema', schema)
        foo() {}
      }

      const actual = getComponents(Controller, 'foo');

      deepStrictEqual(actual, {
        schemas: { schema }
      } as IApiComponents);
    });

  });

  describe('should return the securitySchemes of', () => {

    it('a class.', () => {
      @ApiDefineSecurityScheme('securityScheme', securityScheme)
      class Controller {}

      const actual = getComponents(Controller);

      deepStrictEqual(actual, {
        securitySchemes: { securityScheme }
      } as IApiComponents);
    });

    it('a class method.', () => {
      class Controller {
        @ApiDefineSecurityScheme('securityScheme', securityScheme)
        foo() {}
      }

      const actual = getComponents(Controller, 'foo');

      deepStrictEqual(actual, {
        securitySchemes: { securityScheme }
      } as IApiComponents);
    });

  });

});
