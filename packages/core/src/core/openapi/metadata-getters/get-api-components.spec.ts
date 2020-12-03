import { deepStrictEqual } from 'assert';
import {
  ApiDefineCallback, ApiDefineExample, ApiDefineHeader, ApiDefineLink, ApiDefineParameter,
  ApiDefineRequestBody, ApiDefineResponse, ApiDefineSchema, ApiDefineSecurityScheme
} from '../decorators';
import {
  IApiCallback, IApiComponents, IApiExample, IApiHeader, IApiLink, IApiParameter,
  IApiRequestBody, IApiResponse, IApiSchema, IApiSecurityScheme
} from '../interfaces';
import { getApiComponents } from './get-api-components';

describe('getApiComponents', () => {

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

      const actual = getApiComponents(Controller, new Controller());

      deepStrictEqual(actual, {
        callbacks: { callback }
      } as IApiComponents);
    });

    it('a class (dynamic callbacks).', () => {
      @ApiDefineCallback('callback', (controller: Controller) => controller.callback)
      class Controller {
        callback = callback;
      }

      const actual = getApiComponents(Controller, new Controller());

      deepStrictEqual(actual, {
        callbacks: { callback }
      } as IApiComponents);
    });

    it('a class method.', () => {
      class Controller {
        @ApiDefineCallback('callback', callback)
        foo() {}
      }

      const actual = getApiComponents(Controller, new Controller(), 'foo');

      deepStrictEqual(actual, {
        callbacks: { callback }
      } as IApiComponents);
    });

  });

  describe('should return the examples of', () => {

    it('a class.', () => {
      @ApiDefineExample('example', example)
      class Controller {}

      const actual = getApiComponents(Controller, new Controller());

      deepStrictEqual(actual, {
        examples: { example }
      } as IApiComponents);
    });

    it('a class (dynamic example).', () => {
      @ApiDefineExample('example', (controller: Controller) => controller.example)
      class Controller {
        example = example;
      }

      const actual = getApiComponents(Controller, new Controller());

      deepStrictEqual(actual, {
        examples: { example }
      } as IApiComponents);
    });

    it('a class method.', () => {
      class Controller {
        @ApiDefineExample('example', example)
        foo() {}
      }

      const actual = getApiComponents(Controller, new Controller(), 'foo');

      deepStrictEqual(actual, {
        examples: { example }
      } as IApiComponents);
    });

  });

  describe('should return the headers of', () => {

    it('a class.', () => {
      @ApiDefineHeader('header', header)
      class Controller {}

      const actual = getApiComponents(Controller, new Controller());

      deepStrictEqual(actual, {
        headers: { header }
      } as IApiComponents);
    });

    it('a class (dynamic header).', () => {
      @ApiDefineHeader('header', (controller: Controller) => controller.header)
      class Controller {
        header = header;
      }

      const actual = getApiComponents(Controller, new Controller());

      deepStrictEqual(actual, {
        headers: { header }
      } as IApiComponents);
    });

    it('a class method.', () => {
      class Controller {
        @ApiDefineHeader('header', header)
        foo() {}
      }

      const actual = getApiComponents(Controller, new Controller(), 'foo');

      deepStrictEqual(actual, {
        headers: { header }
      } as IApiComponents);
    });

  });

  describe('should return the links of', () => {

    it('a class.', () => {
      @ApiDefineLink('link', link)
      class Controller {}

      const actual = getApiComponents(Controller, new Controller());

      deepStrictEqual(actual, {
        links: { link }
      } as IApiComponents);
    });

    it('a class (dynamic link).', () => {
      @ApiDefineLink('link', (controller: Controller) => controller.link)
      class Controller {
        link = link;
      }

      const actual = getApiComponents(Controller, new Controller());

      deepStrictEqual(actual, {
        links: { link }
      } as IApiComponents);
    });

    it('a class method.', () => {
      class Controller {
        @ApiDefineLink('link', link)
        foo() {}
      }

      const actual = getApiComponents(Controller, new Controller(), 'foo');

      deepStrictEqual(actual, {
        links: { link }
      } as IApiComponents);
    });

  });

  describe('should return the parameters of', () => {

    it('a class.', () => {
      @ApiDefineParameter('parameter', parameter)
      class Controller {}

      const actual = getApiComponents(Controller, new Controller());

      deepStrictEqual(actual, {
        parameters: { parameter }
      } as IApiComponents);
    });

    it('a class (dynamic parameter).', () => {
      @ApiDefineParameter('parameter', (controller: Controller) => controller.parameter)
      class Controller {
        parameter = parameter;
      }

      const actual = getApiComponents(Controller, new Controller());

      deepStrictEqual(actual, {
        parameters: { parameter }
      } as IApiComponents);
    });

    it('a class method.', () => {
      class Controller {
        @ApiDefineParameter('parameter', parameter)
        foo() {}
      }

      const actual = getApiComponents(Controller, new Controller(), 'foo');

      deepStrictEqual(actual, {
        parameters: { parameter }
      } as IApiComponents);
    });

  });

  describe('should return the requestBodies of', () => {

    it('a class.', () => {
      @ApiDefineRequestBody('requestBody', requestBody)
      class Controller {}

      const actual = getApiComponents(Controller, new Controller());

      deepStrictEqual(actual, {
        requestBodies: { requestBody }
      } as IApiComponents);
    });

    it('a class (dynamic request body).', () => {
      @ApiDefineRequestBody('requestBody', (controller: Controller) => controller.requestBody)
      class Controller {
        requestBody = requestBody;
      }

      const actual = getApiComponents(Controller, new Controller());

      deepStrictEqual(actual, {
        requestBodies: { requestBody }
      } as IApiComponents);
    });

    it('a class method.', () => {
      class Controller {
        @ApiDefineRequestBody('requestBody', requestBody)
        foo() {}
      }

      const actual = getApiComponents(Controller, new Controller(), 'foo');

      deepStrictEqual(actual, {
        requestBodies: { requestBody }
      } as IApiComponents);
    });

  });

  describe('should return the responses of', () => {

    it('a class.', () => {
      @ApiDefineResponse('response', response)
      class Controller {}

      const actual = getApiComponents(Controller, new Controller());

      deepStrictEqual(actual, {
        responses: { response }
      } as IApiComponents);
    });

    it('a class (dynamic response).', () => {
      @ApiDefineResponse('response', (controller: Controller) => controller.response)
      class Controller {
        response = response;
      }

      const actual = getApiComponents(Controller, new Controller());

      deepStrictEqual(actual, {
        responses: { response }
      } as IApiComponents);
    });

    it('a class method.', () => {
      class Controller {
        @ApiDefineResponse('response', response)
        foo() {}
      }

      const actual = getApiComponents(Controller, new Controller(), 'foo');

      deepStrictEqual(actual, {
        responses: { response }
      } as IApiComponents);
    });

  });

  describe('should return the schemas of', () => {

    it('a class.', () => {
      @ApiDefineSchema('schema', schema)
      class Controller {}

      const actual = getApiComponents(Controller, new Controller());

      deepStrictEqual(actual, {
        schemas: { schema }
      } as IApiComponents);
    });

    it('a class (dynamic schema).', () => {
      @ApiDefineSchema('schema', (controller: Controller) => controller.schema)
      class Controller {
        schema = schema;
      }

      const actual = getApiComponents(Controller, new Controller());

      deepStrictEqual(actual, {
        schemas: { schema }
      } as IApiComponents);
    });

    it('a class method.', () => {
      class Controller {
        @ApiDefineSchema('schema', schema)
        foo() {}
      }

      const actual = getApiComponents(Controller, new Controller(), 'foo');

      deepStrictEqual(actual, {
        schemas: { schema }
      } as IApiComponents);
    });

  });

  describe('should return the securitySchemes of', () => {

    it('a class.', () => {
      @ApiDefineSecurityScheme('securityScheme', securityScheme)
      class Controller {}

      const actual = getApiComponents(Controller, new Controller());

      deepStrictEqual(actual, {
        securitySchemes: { securityScheme }
      } as IApiComponents);
    });

    it('a class (dynamic scheme).', () => {
      @ApiDefineSecurityScheme('securityScheme', (controller: Controller) => controller.securityScheme)
      class Controller {
        securityScheme = securityScheme;
      }

      const actual = getApiComponents(Controller, new Controller());

      deepStrictEqual(actual, {
        securitySchemes: { securityScheme }
      } as IApiComponents);
    });

    it('a class method.', () => {
      class Controller {
        @ApiDefineSecurityScheme('securityScheme', securityScheme)
        foo() {}
      }

      const actual = getApiComponents(Controller, new Controller(), 'foo');

      deepStrictEqual(actual, {
        securitySchemes: { securityScheme }
      } as IApiComponents);
    });

  });

});
