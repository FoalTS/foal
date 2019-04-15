import { deepStrictEqual, strictEqual } from 'assert';
import {
  ApiCallback, ApiDeprecated, ApiExternalDoc, ApiOperation, ApiParameter, ApiRequestBody,
  ApiResponse, ApiSecurityRequirement, ApiServer, ApiUseTag
} from '../decorators';
import {
  IApiCallback, IApiExternalDocumentation, IApiParameter, IApiRequestBody, IApiResponse,
  IApiSecurityRequirement, IApiServer
} from '../interfaces';
import { getApiCompleteOperation } from './get-api-complete-operation';

describe('getApiCompleteOperation', () => {

  describe('should return the tags of', () => {

    it('a class method.', () => {
      class Controller {
        foo() {}
      }

      const operation = getApiCompleteOperation(Controller, 'foo');
      strictEqual(operation.hasOwnProperty('tags'), false);

      class Controller2 {
        @ApiUseTag('tag1')
        foo() {}
      }

      const operation2 = getApiCompleteOperation(Controller2, 'foo');
      deepStrictEqual(operation2.tags, [ 'tag1' ]);
    });

  });

  describe('should return the summary of', () => {

    it('a class method.', () => {
      class Controller {
        foo() {}
      }

      const operation = getApiCompleteOperation(Controller, 'foo');
      strictEqual(operation.hasOwnProperty('summary'), false);

      class Controller3 {
        @ApiOperation({
          responses: {},
        })
        foo() {}
      }

      const operation3 = getApiCompleteOperation(Controller3, 'foo');
      strictEqual(operation3.hasOwnProperty('summary'), false);

      class Controller2 {
        @ApiOperation({
          responses: {},
          summary: ''
        })
        foo() {}
      }

      const operation2 = getApiCompleteOperation(Controller2, 'foo');
      strictEqual(operation2.summary, '');
    });

  });

  describe('should return the description of', () => {

    it('a class method.', () => {
      class Controller {
        foo() {}
      }

      const operation = getApiCompleteOperation(Controller, 'foo');
      strictEqual(operation.hasOwnProperty('description'), false);

      class Controller3 {
        @ApiOperation({
          responses: {},
        })
        foo() {}
      }

      const operation3 = getApiCompleteOperation(Controller3, 'foo');
      strictEqual(operation3.hasOwnProperty('description'), false);

      class Controller2 {
        @ApiOperation({
          description: '',
          responses: {},
        })
        foo() {}
      }

      const operation2 = getApiCompleteOperation(Controller2, 'foo');
      strictEqual(operation2.description, '');
    });

  });

  describe('should return the external documentation of', () => {

    it('a class method.', () => {
      class Controller {
        foo() {}
      }

      const operation = getApiCompleteOperation(Controller, 'foo');
      strictEqual(operation.hasOwnProperty('externalDocs'), false);

      const doc: IApiExternalDocumentation = {
        url: 'http://example.com/docs'
      };
      class Controller2 {
        @ApiExternalDoc(doc)
        foo() {}
      }

      const operation2 = getApiCompleteOperation(Controller2, 'foo');
      strictEqual(operation2.externalDocs, doc);
    });

  });

  describe('should return the operationId of', () => {

    it('a class method.', () => {
      class Controller {
        foo() {}
      }

      const operation = getApiCompleteOperation(Controller, 'foo');
      strictEqual(operation.hasOwnProperty('operationId'), false);

      class Controller3 {
        @ApiOperation({
          responses: {},
        })
        foo() {}
      }

      const operation3 = getApiCompleteOperation(Controller3, 'foo');
      strictEqual(operation3.hasOwnProperty('operationId'), false);

      class Controller2 {
        @ApiOperation({
          operationId: 'foo1',
          responses: {},
        })
        foo() {}
      }

      const operation2 = getApiCompleteOperation(Controller2, 'foo');
      strictEqual(operation2.operationId, 'foo1');
    });

  });

  describe('should return the parameters of', () => {

    it('a class method.', () => {
      class Controller {
        foo() {}
      }

      const operation = getApiCompleteOperation(Controller, 'foo');
      strictEqual(operation.hasOwnProperty('parameters'), false);

      const param: IApiParameter = {
        in: 'cookie',
        name: 'parameter1'
      };
      class Controller2 {
        @ApiParameter(param)
        foo() {}
      }

      const operation2 = getApiCompleteOperation(Controller2, 'foo');
      deepStrictEqual(operation2.parameters, [ param ]);
    });

  });

  describe('should return the request body of', () => {

    it('a class method.', () => {
      class Controller {
        foo() {}
      }

      const operation = getApiCompleteOperation(Controller, 'foo');
      strictEqual(operation.hasOwnProperty('requestBody'), false);

      const requestBody: IApiRequestBody = {
        content: {}
      };
      class Controller2 {
        @ApiRequestBody(requestBody)
        foo() {}
      }

      const operation2 = getApiCompleteOperation(Controller2, 'foo');
      strictEqual(operation2.requestBody, requestBody);
    });

  });

  describe('should return the responses of', () => {

    it('a class method.', () => {
      class Controller {
        foo() {}
      }

      const operation = getApiCompleteOperation(Controller, 'foo');
      deepStrictEqual(operation.responses, {});

      const response: IApiResponse = {
        description: 'response1'
      };
      class Controller2 {
        @ApiResponse(200, response)
        foo() {}
      }

      const operation2 = getApiCompleteOperation(Controller2, 'foo');
      deepStrictEqual(operation2.responses, { 200: response });
    });

  });

  describe('should return the callbacks of', () => {

    it('a class method.', () => {
      class Controller {
        foo() {}
      }

      const operation = getApiCompleteOperation(Controller, 'foo');
      strictEqual(operation.hasOwnProperty('callbacks'), false);

      const callback: IApiCallback = {};
      class Controller2 {
        @ApiCallback('callback1', callback)
        foo() {}
      }

      const operation2 = getApiCompleteOperation(Controller2, 'foo');
      deepStrictEqual(operation2.callbacks, {
        callback1: callback
      });
    });

  });

  describe('should return the deprecated flag of', () => {

    it('a class method.', () => {
      class Controller {
        foo() {}
      }

      const operation = getApiCompleteOperation(Controller, 'foo');
      strictEqual(operation.hasOwnProperty('deprecated'), false);

      class Controller2 {
        @ApiDeprecated(false)
        foo() {}
      }

      const operation2 = getApiCompleteOperation(Controller2, 'foo');
      strictEqual(operation2.deprecated, false);
    });

  });

  describe('should return the security requirements of', () => {

    it('a class method.', () => {
      class Controller {
        foo() {}
      }

      const operation = getApiCompleteOperation(Controller, 'foo');
      strictEqual(operation.hasOwnProperty('security'), false);

      const securityRequirement: IApiSecurityRequirement = {};
      class Controller2 {
        @ApiSecurityRequirement(securityRequirement)
        foo() {}
      }

      const operation2 = getApiCompleteOperation(Controller2, 'foo');
      deepStrictEqual(operation2.security, [ securityRequirement ]);
    });

  });

  describe('should return the servers of', () => {

    it('a class method.', () => {
      class Controller {
        foo() {}
      }

      const operation = getApiCompleteOperation(Controller, 'foo');
      strictEqual(operation.hasOwnProperty('servers'), false);

      const server: IApiServer = {
        url: 'http://example.com'
      };
      class Controller2 {
        @ApiServer(server)
        foo() {}
      }

      const operation2 = getApiCompleteOperation(Controller2, 'foo');
      deepStrictEqual(operation2.servers, [ server ]);
    });

  });

  it('should override the @ApiOperation metadata with the other other decorators metadata (@ApiServer, etc).');
  // Caution: value false of the deprecated flag.
});
