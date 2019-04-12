// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import { controller } from '../common';
import { Get, Post } from '../core';
import { createOpenApiDocument } from './create-open-api-document';
import {
  ApiDefineCallback, ApiDefineExample, ApiDefineHeader, ApiDefineLink,
  ApiDefineParameter, ApiDefineRequestBody, ApiDefineResponse, ApiDefineSchema,
  ApiDefineSecurityScheme, ApiDefineTag, ApiExternalDoc, ApiInfo, ApiSecurityRequirement, ApiServer
} from './decorators';
import {
  IApiCallback, IApiExample, IApiExternalDocumentation, IApiHeader, IApiLink,
  IApiParameter, IApiRequestBody, IApiResponse, IApiSchema, IApiSecurityRequirement, IApiSecurityScheme, IApiServer, IApiTag
} from './interfaces';

describe('createOpenApiDocument', () => {

  const infoMetadata = {
    title: 'foo',
    version: '0.0.0'
  };

  it('should return a document using the version 3.0 of OpenAPI.', () => {
    @ApiInfo(infoMetadata)
    class Controller {}

    const document = createOpenApiDocument(Controller);
    strictEqual(document.openapi, '3.0.0');
  });

  it('should throw an Error if no api:info is found on the root controller.', done => {
    class Controller {}

    try {
      createOpenApiDocument(Controller);
      done(new Error('The function should have thrown an Error.'));
    } catch (error) {
      strictEqual(error.message, 'The API root controller should be decorated with @ApiInfo.');
      done();
    }
  });

  it('should return the document info.', () => {
    const metadata = {
      title: 'foo',
      version: '0.0.0'
    };
    @ApiInfo(metadata)
    class Controller {}

    const document = createOpenApiDocument(Controller);
    strictEqual(document.info, metadata);
  });

  describe('should define a schema when @ApiDefineSchema decorates', () => {

    const schema1: IApiSchema = {
      title: 'my schema'
    };
    const schema2: IApiSchema = {
      title: 'my schema2'
    };
    const schema3: IApiSchema = {
      title: 'my schema3'
    };
    const schema4: IApiSchema = {
      title: 'my schema4'
    };

    it('the root controller.', () => {
      @ApiInfo(infoMetadata)
      @ApiDefineSchema('schema1', schema1)
      @ApiDefineSchema('schema2', schema2)
      class Controller {}

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.schemas) {
        throw new Error('The document should have a "components.schemas" section.');
      }

      deepStrictEqual(document.components.schemas, { schema1, schema2 });
    });

    it('a sub-controller.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        subControllers = [
          SubController
        ];
      }

      @ApiDefineSchema('schema1', schema1)
      @ApiDefineSchema('schema2', schema2)
      class SubController {}

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.schemas) {
        throw new Error('The document should have a "components.schemas" section.');
      }

      deepStrictEqual(document.components.schemas, { schema1, schema2 });
    });

    it('a method.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        @Get()
        @ApiDefineSchema('schema1', schema1)
        @ApiDefineSchema('schema2', schema2)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.schemas) {
        throw new Error('The document should have a "components.schemas" section.');
      }

      deepStrictEqual(document.components.schemas, { schema1, schema2 });
    });

    it('a method of a sub-controller.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        subControllers = [
          SubController
        ];
      }

      class SubController {
        @Get()
        @ApiDefineSchema('schema1', schema1)
        @ApiDefineSchema('schema2', schema2)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.schemas) {
        throw new Error('The document should have a "components.schemas" section.');
      }

      deepStrictEqual(document.components.schemas, { schema1, schema2 });
    });

    it('all of them.', () => {
      @ApiInfo(infoMetadata)
      @ApiDefineSchema('schema1', schema1)
      class Controller {
        subControllers = [
          SubController
        ];

        @Get()
        @ApiDefineSchema('schema2', schema2)
        foo() {}
      }

      @ApiDefineSchema('schema3', schema3)
      class SubController {
        @Get()
        @ApiDefineSchema('schema4', schema4)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.schemas) {
        throw new Error('The document should have a "components.schemas" section.');
      }

      deepStrictEqual(document.components.schemas, { schema1, schema2, schema3, schema4 });
    });

  });

  describe('should define a response when @ApiDefineResponse decorates', () => {

    const response1: IApiResponse = {
      description: 'my response'
    };
    const response2: IApiResponse = {
      description: 'my response2'
    };
    const response3: IApiResponse = {
      description: 'my response3'
    };
    const response4: IApiResponse = {
      description: 'my response4'
    };

    it('the root controller.', () => {
      @ApiInfo(infoMetadata)
      @ApiDefineResponse('response1', response1)
      @ApiDefineResponse('response2', response2)
      class Controller {}

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.responses) {
        throw new Error('The document should have a "components.responses" section.');
      }

      deepStrictEqual(document.components.responses, { response1, response2 });
    });

    it('a sub-controller.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        subControllers = [
          SubController
        ];
      }

      @ApiDefineResponse('response1', response1)
      @ApiDefineResponse('response2', response2)
      class SubController {}

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.responses) {
        throw new Error('The document should have a "components.responses" section.');
      }

      deepStrictEqual(document.components.responses, { response1, response2 });
    });

    it('a method.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        @Get()
        @ApiDefineResponse('response1', response1)
        @ApiDefineResponse('response2', response2)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.responses) {
        throw new Error('The document should have a "components.responses" section.');
      }

      deepStrictEqual(document.components.responses, { response1, response2 });
    });

    it('a method of a sub-controller.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        subControllers = [
          SubController
        ];
      }

      class SubController {
        @Get()
        @ApiDefineResponse('response1', response1)
        @ApiDefineResponse('response2', response2)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.responses) {
        throw new Error('The document should have a "components.responses" section.');
      }

      deepStrictEqual(document.components.responses, { response1, response2 });
    });

    it('all of them.', () => {
      @ApiInfo(infoMetadata)
      @ApiDefineResponse('response1', response1)
      class Controller {
        subControllers = [
          SubController
        ];

        @Get()
        @ApiDefineResponse('response2', response2)
        foo() {}
      }

      @ApiDefineResponse('response3', response3)
      class SubController {
        @Get()
        @ApiDefineResponse('response4', response4)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.responses) {
        throw new Error('The document should have a "components.responses" section.');
      }

      deepStrictEqual(document.components.responses, { response1, response2, response3, response4 });
    });

  });

  describe('should define a parameter when @ApiDefineParameter decorates', () => {

    const parameter1: IApiParameter = {
      in: 'cookie',
      name: 'parameter1',
    };
    const parameter2: IApiParameter = {
      in: 'cookie',
      name: 'parameter2',
    };
    const parameter3: IApiParameter = {
      in: 'cookie',
      name: 'parameter3',
    };
    const parameter4: IApiParameter = {
      in: 'cookie',
      name: 'parameter4',
    };

    it('the root controller.', () => {
      @ApiInfo(infoMetadata)
      @ApiDefineParameter('parameter1', parameter1)
      @ApiDefineParameter('parameter2', parameter2)
      class Controller {}

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.parameters) {
        throw new Error('The document should have a "components.parameters" section.');
      }

      deepStrictEqual(document.components.parameters, { parameter1, parameter2 });
    });

    it('a sub-controller.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        subControllers = [
          SubController
        ];
      }

      @ApiDefineParameter('parameter1', parameter1)
      @ApiDefineParameter('parameter2', parameter2)
      class SubController {}

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.parameters) {
        throw new Error('The document should have a "components.parameters" section.');
      }

      deepStrictEqual(document.components.parameters, { parameter1, parameter2 });
    });

    it('a method.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        @Get()
        @ApiDefineParameter('parameter1', parameter1)
        @ApiDefineParameter('parameter2', parameter2)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.parameters) {
        throw new Error('The document should have a "components.parameters" section.');
      }

      deepStrictEqual(document.components.parameters, { parameter1, parameter2 });
    });

    it('a method of a sub-controller.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        subControllers = [
          SubController
        ];
      }

      class SubController {
        @Get()
        @ApiDefineParameter('parameter1', parameter1)
        @ApiDefineParameter('parameter2', parameter2)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.parameters) {
        throw new Error('The document should have a "components.parameters" section.');
      }

      deepStrictEqual(document.components.parameters, { parameter1, parameter2 });
    });

    it('all of them.', () => {
      @ApiInfo(infoMetadata)
      @ApiDefineParameter('parameter1', parameter1)
      class Controller {
        subControllers = [
          SubController
        ];

        @Get()
        @ApiDefineParameter('parameter2', parameter2)
        foo() {}
      }

      @ApiDefineParameter('parameter3', parameter3)
      class SubController {
        @Get()
        @ApiDefineParameter('parameter4', parameter4)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.parameters) {
        throw new Error('The document should have a "components.parameters" section.');
      }

      deepStrictEqual(document.components.parameters, { parameter1, parameter2, parameter3, parameter4 });
    });

  });

  describe('should define an example when @ApiDefineExample decorates', () => {

    const example1: IApiExample = {
      summary: 'example1',
    };
    const example2: IApiExample = {
      summary: 'example2',
    };
    const example3: IApiExample = {
      summary: 'example3',
    };
    const example4: IApiExample = {
      summary: 'example4',
    };

    it('the root controller.', () => {
      @ApiInfo(infoMetadata)
      @ApiDefineExample('example1', example1)
      @ApiDefineExample('example2', example2)
      class Controller {}

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.examples) {
        throw new Error('The document should have a "components.examples" section.');
      }

      deepStrictEqual(document.components.examples, { example1, example2 });
    });

    it('a sub-controller.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        subControllers = [
          SubController
        ];
      }

      @ApiDefineExample('example1', example1)
      @ApiDefineExample('example2', example2)
      class SubController {}

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.examples) {
        throw new Error('The document should have a "components.examples" section.');
      }

      deepStrictEqual(document.components.examples, { example1, example2 });
    });

    it('a method.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        @Get()
        @ApiDefineExample('example1', example1)
        @ApiDefineExample('example2', example2)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.examples) {
        throw new Error('The document should have a "components.examples" section.');
      }

      deepStrictEqual(document.components.examples, { example1, example2 });
    });

    it('a method of a sub-controller.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        subControllers = [
          SubController
        ];
      }

      class SubController {
        @Get()
        @ApiDefineExample('example1', example1)
        @ApiDefineExample('example2', example2)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.examples) {
        throw new Error('The document should have a "components.examples" section.');
      }

      deepStrictEqual(document.components.examples, { example1, example2 });
    });

    it('all of them.', () => {
      @ApiInfo(infoMetadata)
      @ApiDefineExample('example1', example1)
      class Controller {
        subControllers = [
          SubController
        ];

        @Get()
        @ApiDefineExample('example2', example2)
        foo() {}
      }

      @ApiDefineExample('example3', example3)
      class SubController {
        @Get()
        @ApiDefineExample('example4', example4)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.examples) {
        throw new Error('The document should have a "components.examples" section.');
      }

      deepStrictEqual(document.components.examples, { example1, example2, example3, example4 });
    });

  });

  describe('should define a request body when @ApiDefineRequestBody decorates', () => {

    const requestBody1: IApiRequestBody = {
      content: {},
      description: 'requestBody1',
    };
    const requestBody2: IApiRequestBody = {
      content: {},
      description: 'requestBody2',
    };
    const requestBody3: IApiRequestBody = {
      content: {},
      description: 'requestBody3',
    };
    const requestBody4: IApiRequestBody = {
      content: {},
      description: 'requestBody4',
    };

    it('the root controller.', () => {
      @ApiInfo(infoMetadata)
      @ApiDefineRequestBody('requestBody1', requestBody1)
      @ApiDefineRequestBody('requestBody2', requestBody2)
      class Controller {}

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.requestBodies) {
        throw new Error('The document should have a "components.requestBodies" section.');
      }

      deepStrictEqual(document.components.requestBodies, { requestBody1, requestBody2 });
    });

    it('a sub-controller.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        subControllers = [
          SubController
        ];
      }

      @ApiDefineRequestBody('requestBody1', requestBody1)
      @ApiDefineRequestBody('requestBody2', requestBody2)
      class SubController {}

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.requestBodies) {
        throw new Error('The document should have a "components.requestBodies" section.');
      }

      deepStrictEqual(document.components.requestBodies, { requestBody1, requestBody2 });
    });

    it('a method.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        @Get()
        @ApiDefineRequestBody('requestBody1', requestBody1)
        @ApiDefineRequestBody('requestBody2', requestBody2)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.requestBodies) {
        throw new Error('The document should have a "components.requestBodies" section.');
      }

      deepStrictEqual(document.components.requestBodies, { requestBody1, requestBody2 });
    });

    it('a method of a sub-controller.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        subControllers = [
          SubController
        ];
      }

      class SubController {
        @Get()
        @ApiDefineRequestBody('requestBody1', requestBody1)
        @ApiDefineRequestBody('requestBody2', requestBody2)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.requestBodies) {
        throw new Error('The document should have a "components.requestBodies" section.');
      }

      deepStrictEqual(document.components.requestBodies, { requestBody1, requestBody2 });
    });

    it('all of them.', () => {
      @ApiInfo(infoMetadata)
      @ApiDefineRequestBody('requestBody1', requestBody1)
      class Controller {
        subControllers = [
          SubController
        ];

        @Get()
        @ApiDefineRequestBody('requestBody2', requestBody2)
        foo() {}
      }

      @ApiDefineRequestBody('requestBody3', requestBody3)
      class SubController {
        @Get()
        @ApiDefineRequestBody('requestBody4', requestBody4)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.requestBodies) {
        throw new Error('The document should have a "components.requestBodies" section.');
      }

      deepStrictEqual(document.components.requestBodies, { requestBody1, requestBody2, requestBody3, requestBody4 });
    });

  });

  describe('should define a header when @ApiDefineHeader decorates', () => {

    const header1: IApiHeader = {
      content: {},
      description: 'header1',
    };
    const header2: IApiHeader = {
      content: {},
      description: 'header2',
    };
    const header3: IApiHeader = {
      content: {},
      description: 'header3',
    };
    const header4: IApiHeader = {
      content: {},
      description: 'header4',
    };

    it('the root controller.', () => {
      @ApiInfo(infoMetadata)
      @ApiDefineHeader('header1', header1)
      @ApiDefineHeader('header2', header2)
      class Controller {}

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.headers) {
        throw new Error('The document should have a "components.headers" section.');
      }

      deepStrictEqual(document.components.headers, { header1, header2 });
    });

    it('a sub-controller.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        subControllers = [
          SubController
        ];
      }

      @ApiDefineHeader('header1', header1)
      @ApiDefineHeader('header2', header2)
      class SubController {}

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.headers) {
        throw new Error('The document should have a "components.headers" section.');
      }

      deepStrictEqual(document.components.headers, { header1, header2 });
    });

    it('a method.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        @Get()
        @ApiDefineHeader('header1', header1)
        @ApiDefineHeader('header2', header2)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.headers) {
        throw new Error('The document should have a "components.headers" section.');
      }

      deepStrictEqual(document.components.headers, { header1, header2 });
    });

    it('a method of a sub-controller.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        subControllers = [
          SubController
        ];
      }

      class SubController {
        @Get()
        @ApiDefineHeader('header1', header1)
        @ApiDefineHeader('header2', header2)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.headers) {
        throw new Error('The document should have a "components.headers" section.');
      }

      deepStrictEqual(document.components.headers, { header1, header2 });
    });

    it('all of them.', () => {
      @ApiInfo(infoMetadata)
      @ApiDefineHeader('header1', header1)
      class Controller {
        subControllers = [
          SubController
        ];

        @Get()
        @ApiDefineHeader('header2', header2)
        foo() {}
      }

      @ApiDefineHeader('header3', header3)
      class SubController {
        @Get()
        @ApiDefineHeader('header4', header4)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.headers) {
        throw new Error('The document should have a "components.headers" section.');
      }

      deepStrictEqual(document.components.headers, { header1, header2, header3, header4 });
    });

  });

  describe('should define a security scheme when @ApiDefineSecurityScheme decorates', () => {

    const securityScheme1: IApiSecurityScheme = {
      openIdConnectUrl: 'securityScheme1',
      type: 'openIdConnect',
    };
    const securityScheme2: IApiSecurityScheme = {
      openIdConnectUrl: 'securityScheme2',
      type: 'openIdConnect',
    };
    const securityScheme3: IApiSecurityScheme = {
      openIdConnectUrl: 'securityScheme3',
      type: 'openIdConnect',
    };
    const securityScheme4: IApiSecurityScheme = {
      openIdConnectUrl: 'securityScheme4',
      type: 'openIdConnect',
    };

    it('the root controller.', () => {
      @ApiInfo(infoMetadata)
      @ApiDefineSecurityScheme('securityScheme1', securityScheme1)
      @ApiDefineSecurityScheme('securityScheme2', securityScheme2)
      class Controller {}

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.securitySchemes) {
        throw new Error('The document should have a "components.securitySchemes" section.');
      }

      deepStrictEqual(document.components.securitySchemes, { securityScheme1, securityScheme2 });
    });

    it('a sub-controller.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        subControllers = [
          SubController
        ];
      }

      @ApiDefineSecurityScheme('securityScheme1', securityScheme1)
      @ApiDefineSecurityScheme('securityScheme2', securityScheme2)
      class SubController {}

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.securitySchemes) {
        throw new Error('The document should have a "components.securitySchemes" section.');
      }

      deepStrictEqual(document.components.securitySchemes, { securityScheme1, securityScheme2 });
    });

    it('a method.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        @Get()
        @ApiDefineSecurityScheme('securityScheme1', securityScheme1)
        @ApiDefineSecurityScheme('securityScheme2', securityScheme2)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.securitySchemes) {
        throw new Error('The document should have a "components.securitySchemes" section.');
      }

      deepStrictEqual(document.components.securitySchemes, { securityScheme1, securityScheme2 });
    });

    it('a method of a sub-controller.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        subControllers = [
          SubController
        ];
      }

      class SubController {
        @Get()
        @ApiDefineSecurityScheme('securityScheme1', securityScheme1)
        @ApiDefineSecurityScheme('securityScheme2', securityScheme2)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.securitySchemes) {
        throw new Error('The document should have a "components.securitySchemes" section.');
      }

      deepStrictEqual(document.components.securitySchemes, { securityScheme1, securityScheme2 });
    });

    it('all of them.', () => {
      @ApiInfo(infoMetadata)
      @ApiDefineSecurityScheme('securityScheme1', securityScheme1)
      class Controller {
        subControllers = [
          SubController
        ];

        @Get()
        @ApiDefineSecurityScheme('securityScheme2', securityScheme2)
        foo() {}
      }

      @ApiDefineSecurityScheme('securityScheme3', securityScheme3)
      class SubController {
        @Get()
        @ApiDefineSecurityScheme('securityScheme4', securityScheme4)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.securitySchemes) {
        throw new Error('The document should have a "components.securitySchemes" section.');
      }

      deepStrictEqual(
        document.components.securitySchemes,
        { securityScheme1, securityScheme2, securityScheme3, securityScheme4 }
      );
    });

  });

  describe('should define a link when @ApiDefineLink decorates', () => {

    const link1: IApiLink = {
      description: 'link1',
    };
    const link2: IApiLink = {
      description: 'link2',
    };
    const link3: IApiLink = {
      description: 'link3',
    };
    const link4: IApiLink = {
      description: 'link4',
    };

    it('the root controller.', () => {
      @ApiInfo(infoMetadata)
      @ApiDefineLink('link1', link1)
      @ApiDefineLink('link2', link2)
      class Controller {}

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.links) {
        throw new Error('The document should have a "components.links" section.');
      }

      deepStrictEqual(document.components.links, { link1, link2 });
    });

    it('a sub-controller.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        subControllers = [
          SubController
        ];
      }

      @ApiDefineLink('link1', link1)
      @ApiDefineLink('link2', link2)
      class SubController {}

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.links) {
        throw new Error('The document should have a "components.links" section.');
      }

      deepStrictEqual(document.components.links, { link1, link2 });
    });

    it('a method.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        @Get()
        @ApiDefineLink('link1', link1)
        @ApiDefineLink('link2', link2)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.links) {
        throw new Error('The document should have a "components.links" section.');
      }

      deepStrictEqual(document.components.links, { link1, link2 });
    });

    it('a method of a sub-controller.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        subControllers = [
          SubController
        ];
      }

      class SubController {
        @Get()
        @ApiDefineLink('link1', link1)
        @ApiDefineLink('link2', link2)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.links) {
        throw new Error('The document should have a "components.links" section.');
      }

      deepStrictEqual(document.components.links, { link1, link2 });
    });

    it('all of them.', () => {
      @ApiInfo(infoMetadata)
      @ApiDefineLink('link1', link1)
      class Controller {
        subControllers = [
          SubController
        ];

        @Get()
        @ApiDefineLink('link2', link2)
        foo() {}
      }

      @ApiDefineLink('link3', link3)
      class SubController {
        @Get()
        @ApiDefineLink('link4', link4)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.links) {
        throw new Error('The document should have a "components.links" section.');
      }

      deepStrictEqual(document.components.links, { link1, link2, link3, link4 });
    });

  });

  describe('should define a callback when @ApiDefineCallback decorates', () => {

    const callback1: IApiCallback = {
      a: {
        description: 'callback1',
      }
    };
    const callback2: IApiCallback = {
      a: {
        description: 'callback2',
      }
    };
    const callback3: IApiCallback = {
      a: {
        description: 'callback3',
      }
    };
    const callback4: IApiCallback = {
      a: {
        description: 'callback4',
      }
    };

    it('the root controller.', () => {
      @ApiInfo(infoMetadata)
      @ApiDefineCallback('callback1', callback1)
      @ApiDefineCallback('callback2', callback2)
      class Controller {}

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.callbacks) {
        throw new Error('The document should have a "components.callbacks" section.');
      }

      deepStrictEqual(document.components.callbacks, { callback1, callback2 });
    });

    it('a sub-controller.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        subControllers = [
          SubController
        ];
      }

      @ApiDefineCallback('callback1', callback1)
      @ApiDefineCallback('callback2', callback2)
      class SubController {}

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.callbacks) {
        throw new Error('The document should have a "components.callbacks" section.');
      }

      deepStrictEqual(document.components.callbacks, { callback1, callback2 });
    });

    it('a method.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        @Get()
        @ApiDefineCallback('callback1', callback1)
        @ApiDefineCallback('callback2', callback2)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.callbacks) {
        throw new Error('The document should have a "components.callbacks" section.');
      }

      deepStrictEqual(document.components.callbacks, { callback1, callback2 });
    });

    it('a method of a sub-controller.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        subControllers = [
          SubController
        ];
      }

      class SubController {
        @Get()
        @ApiDefineCallback('callback1', callback1)
        @ApiDefineCallback('callback2', callback2)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.callbacks) {
        throw new Error('The document should have a "components.callbacks" section.');
      }

      deepStrictEqual(document.components.callbacks, { callback1, callback2 });
    });

    it('all of them.', () => {
      @ApiInfo(infoMetadata)
      @ApiDefineCallback('callback1', callback1)
      class Controller {
        subControllers = [
          SubController
        ];

        @Get()
        @ApiDefineCallback('callback2', callback2)
        foo() {}
      }

      @ApiDefineCallback('callback3', callback3)
      class SubController {
        @Get()
        @ApiDefineCallback('callback4', callback4)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      if (!document.components) {
        throw new Error('The document should have a "components" section.');
      }

      if (!document.components.callbacks) {
        throw new Error('The document should have a "components.callbacks" section.');
      }

      deepStrictEqual(document.components.callbacks, { callback1, callback2, callback3, callback4 });
    });

  });

  describe('should define a tag when @ApiDefineTag decorates', () => {

    const tag1: IApiTag = {
      name: 'tag1',
    };
    const tag2: IApiTag = {
      name: 'tag2',
    };
    const tag3: IApiTag = {
      name: 'tag3',
    };
    const tag4: IApiTag = {
      name: 'tag4',
    };

    it('the root controller.', () => {
      @ApiInfo(infoMetadata)
      @ApiDefineTag(tag1)
      @ApiDefineTag(tag2)
      class Controller {}

      const document = createOpenApiDocument(Controller);

      if (!document.tags) {
        throw new Error('The document should have a "tags" section.');
      }

      deepStrictEqual(document.tags, [ tag1, tag2 ]);
    });

    it('a sub-controller.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        subControllers = [
          SubController
        ];
      }

      @ApiDefineTag(tag1)
      @ApiDefineTag(tag2)
      class SubController {}

      const document = createOpenApiDocument(Controller);

      if (!document.tags) {
        throw new Error('The document should have a "tags" section.');
      }

      deepStrictEqual(document.tags, [ tag1, tag2 ]);
    });

    it('a method.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        @Get()
        @ApiDefineTag(tag1)
        @ApiDefineTag(tag2)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      if (!document.tags) {
        throw new Error('The document should have a "tags" section.');
      }

      deepStrictEqual(document.tags, [ tag1, tag2 ]);
    });

    it('a method of a sub-controller.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        subControllers = [
          SubController
        ];
      }

      class SubController {
        @Get()
        @ApiDefineTag(tag1)
        @ApiDefineTag(tag2)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      if (!document.tags) {
        throw new Error('The document should have a "tags" section.');
      }

      deepStrictEqual(document.tags, [ tag1, tag2 ]);
    });

    it('all of them.', () => {
      @ApiInfo(infoMetadata)
      @ApiDefineTag(tag1)
      class Controller {
        subControllers = [
          SubController
        ];

        @Get()
        @ApiDefineTag(tag2)
        foo() {}
      }

      @ApiDefineTag(tag3)
      class SubController {
        @Get()
        @ApiDefineTag(tag4)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      if (!document.tags) {
        throw new Error('The document should have a "tags" section.');
      }

      deepStrictEqual(document.tags, [ tag1, tag3, tag4, tag2 ]);
    });

  });

  describe('should return the paths and methods', () => {

    it('of the root controller.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        @Get('/products')
        readProducts() {}

        @Get('/products/1')
        readProduct() {}
      }

      const document = createOpenApiDocument(Controller);

      deepStrictEqual(document.paths['/products'], { get: { responses: {} } });
      deepStrictEqual(document.paths['/products/1'], { get: { responses: {} } });
    });

    it('of the sub controllers.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        subControllers = [
          controller('/api', ApiController)
        ];
      }

      class ApiController {
        subControllers = [
          controller('/products', ProductController)
        ];
      }

      class ProductController {
        @Get()
        readProducts() {}

        @Get('/1')
        readProduct() {}
      }

      const document = createOpenApiDocument(Controller);

      deepStrictEqual(document.paths, {
        '/api/products': { get: { responses: {} } },
        '/api/products/1': { get: { responses: {} } },
      });
    });

    it('with the proper path templating.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        @Get('/api/users/:userId/products/:productId')
        something() {}
      }

      const document = createOpenApiDocument(Controller);

      deepStrictEqual(document.paths, {
        '/api/users/{userId}/products/{productId}': { get: { responses: {} } }
      });
    });

    it('which paths always start with a slash.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        subControllers = [
          controller('/products', ProductController)
        ];

        @Get()
        index() {}

        @Get('api')
        api() {}
      }

      class ProductController {
        @Get()
        readProduct() {}
      }

      const document = createOpenApiDocument(Controller);

      deepStrictEqual(document.paths, {
        '/': { get: { responses: {} } },
        '/api': { get: { responses: {} } },
        '/products': { get: { responses: {} } }
      });
    });

    it('without duplicate paths for different methods.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        @Get('/products')
        readProducts() {}

        @Post('/products')
        createProduct() {}
      }

      const document = createOpenApiDocument(Controller);

      deepStrictEqual(document.paths, {
        '/products': {
          get: { responses: {} },
          post: { responses: {} }
        }
      });
    });

    it('or throw an error if paths are in conflict.', done => {
      @ApiInfo(infoMetadata)
      class Controller {
        @Get('/api/users/:userId/products/:productId')
        something() {}

        @Get('/api/users/:userId2/products/:productId2')
        something2() {}
      }

      try {
        createOpenApiDocument(Controller);
        done(new Error('The function should have thrown an Error.'));
      } catch (error) {
        strictEqual(
          error.message,
          'Templated paths with the same hierarchy but different templated names MUST NOT exist as they are identical.'
          + '\n  Path 1: /api/users/{userId}/products/{productId}'
          + '\n  Path 2: /api/users/{userId2}/products/{productId2}'
        );
        done();
      }
    });

  });

  describe('should specify an external doc when @ApiExternalDoc decorates', () => {

    const externalDocumentation: IApiExternalDocumentation = {
      url: 'http://examples.com/docs'
    };
    const externalDocumentation2: IApiExternalDocumentation = {
      url: 'http://examples2.com/docs'
    };

    it('the root controller.', () => {
      @ApiInfo(infoMetadata)
      @ApiExternalDoc(externalDocumentation)
      class Controller {
        @Get()
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      strictEqual(document.externalDocs, externalDocumentation);
      deepStrictEqual(document.paths, {
        '/': {
          // No externa docs here.
          get: { responses: {} }
        }
      });
    });

    it('a method.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        @Get('/foo')
        @ApiExternalDoc(externalDocumentation)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      deepStrictEqual(document.paths, {
        '/foo': {
          get: {
            externalDocs: externalDocumentation,
            responses: {}
          }
        }
      });
    });

    it('a sub-controller.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        subControllers = [
          ApiController
        ];
      }

      @ApiExternalDoc(externalDocumentation)
      class ApiController {
        subControllers = [
          ProductController
        ];
      }

      class ProductController {
        @Get('/foo')
        foo() {}

        @Get('/bar')
        @ApiExternalDoc(externalDocumentation2)
        bar() {}
      }

      const document = createOpenApiDocument(Controller);

      deepStrictEqual(document.paths, {
        '/bar': {
          get: {
            externalDocs: externalDocumentation2,
            responses: {}
          }
        },
        '/foo': {
          get: {
            externalDocs: externalDocumentation,
            responses: {}
          }
        },
      });
    });

  });

  describe('should specify a server when @ApiServer decorates', () => {

    const server: IApiServer = {
      url: 'http://examples.com'
    };
    const server2: IApiServer = {
      url: 'http://examples2.com'
    };

    it('the root controller.', () => {
      @ApiInfo(infoMetadata)
      @ApiServer(server)
      @ApiServer(server2)
      class Controller {
        @Get()
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      deepStrictEqual(document.servers, [ server, server2 ]);
      deepStrictEqual(document.paths, {
        '/': {
          // No servers here.
          get: { responses: {} }
        }
      });
    });

    it('a method.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        @Get('/foo')
        @ApiServer(server)
        @ApiServer(server2)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      deepStrictEqual(document.paths, {
        '/foo': {
          get: {
            responses: {},
            servers: [ server, server2 ],
          }
        }
      });
    });

    it('a sub-controller.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        subControllers = [
          ApiController
        ];
      }

      @ApiServer(server)
      class ApiController {
        subControllers = [
          ProductController
        ];
      }

      class ProductController {
        @Get('/foo')
        foo() {}

        @Get('/bar')
        @ApiServer(server2)
        bar() {}
      }

      const document = createOpenApiDocument(Controller);

      deepStrictEqual(document.paths, {
        '/bar': {
          get: {
            responses: {},
            servers: [ server2 ],
          }
        },
        '/foo': {
          get: {
            responses: {},
            servers: [ server ],
          }
        },
      });
    });

  });

  describe('should specify a security requirement when @ApiSecurityRequirements decorates', () => {

    const security: IApiSecurityRequirement = {
      a: [ 'b' ]
    };
    const security2: IApiSecurityRequirement = {
      c: [ 'd' ]
    };

    it('the root controller.', () => {
      @ApiInfo(infoMetadata)
      @ApiSecurityRequirement(security)
      @ApiSecurityRequirement(security2)
      class Controller {
        @Get()
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      deepStrictEqual(document.security, [ security, security2 ]);
      deepStrictEqual(document.paths, {
        '/': {
          // No servers here.
          get: { responses: {} }
        }
      });
    });

    it('a method.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        @Get('/foo')
        @ApiSecurityRequirement(security)
        @ApiSecurityRequirement(security2)
        foo() {}
      }

      const document = createOpenApiDocument(Controller);

      deepStrictEqual(document.paths, {
        '/foo': {
          get: {
            responses: {},
            security: [ security, security2 ],
          }
        }
      });
    });

    it('a sub-controller.', () => {
      @ApiInfo(infoMetadata)
      class Controller {
        subControllers = [
          ApiController
        ];
      }

      @ApiSecurityRequirement(security)
      class ApiController {
        subControllers = [
          ProductController
        ];
      }

      class ProductController {
        @Get('/foo')
        foo() {}

        @Get('/bar')
        @ApiSecurityRequirement(security2)
        bar() {}
      }

      const document = createOpenApiDocument(Controller);

      deepStrictEqual(document.paths, {
        '/bar': {
          get: {
            responses: {},
            security: [ security2 ],
          }
        },
        '/foo': {
          get: {
            responses: {},
            security: [ security ],
          }
        },
      });
    });

  });

});
