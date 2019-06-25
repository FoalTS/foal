import { deepStrictEqual, strictEqual } from 'assert';
import {
  ApiCallback, ApiDeprecated, ApiExternalDoc, ApiOperation, ApiOperationDescription, ApiOperationId,
  ApiOperationSummary, ApiParameter, ApiRequestBody, ApiResponse, ApiSecurityRequirement, ApiServer, ApiUseTag
} from '../decorators';
import {
  IApiCallback, IApiExternalDocumentation, IApiParameter, IApiRequestBody, IApiResponse,
  IApiSecurityRequirement, IApiServer
} from '../interfaces';
import { getApiCompleteOperation } from './get-api-complete-operation';

describe('getApiCompleteOperation', () => {

  describe('should return the tags of', () => {

    it('a class.', () => {
      class Controller {}

      const operation = getApiCompleteOperation(Controller, new Controller());
      strictEqual(operation.hasOwnProperty('tags'), false);

      @ApiUseTag('tag1')
      class Controller2 {}

      const operation2 = getApiCompleteOperation(Controller2, new Controller2());
      deepStrictEqual(operation2.tags, [ 'tag1' ]);
    });

    it('a class method.', () => {
      class Controller {
        foo() {}
      }

      const operation = getApiCompleteOperation(Controller, new Controller(), 'foo');
      strictEqual(operation.hasOwnProperty('tags'), false);

      class Controller2 {
        @ApiUseTag('tag1')
        foo() {}
      }

      const operation2 = getApiCompleteOperation(Controller2, new Controller2(), 'foo');
      deepStrictEqual(operation2.tags, [ 'tag1' ]);
    });

  });

  describe('should return the summary of', () => {

    it('a class.', () => {
      class Controller {}

      const operation = getApiCompleteOperation(Controller, new Controller());
      strictEqual(operation.hasOwnProperty('summary'), false);

      @ApiOperationSummary('')
      class Controller2 {}

      const operation2 = getApiCompleteOperation(Controller2, new Controller2());
      strictEqual(operation2.summary, '');
    });

    it('a class method.', () => {
      class Controller {
        foo() {}
      }

      const operation = getApiCompleteOperation(Controller, new Controller(), 'foo');
      strictEqual(operation.hasOwnProperty('summary'), false);

      class Controller2 {
        @ApiOperationSummary('')
        foo() {}
      }

      const operation2 = getApiCompleteOperation(Controller2, new Controller2(), 'foo');
      strictEqual(operation2.summary, '');
    });

  });

  describe('should return the operationId of', () => {

    it('a class.', () => {
      class Controller {}

      const operation = getApiCompleteOperation(Controller, new Controller());
      strictEqual(operation.hasOwnProperty('operationId'), false);

      @ApiOperationId('')
      class Controller2 {}

      const operation2 = getApiCompleteOperation(Controller2, new Controller2());
      strictEqual(operation2.operationId, '');
    });

    it('a class method.', () => {
      class Controller {
        foo() {}
      }

      const operation = getApiCompleteOperation(Controller, new Controller(), 'foo');
      strictEqual(operation.hasOwnProperty('operationId'), false);

      class Controller2 {
        @ApiOperationId('')
        foo() {}
      }

      const operation2 = getApiCompleteOperation(Controller2, new Controller2(), 'foo');
      strictEqual(operation2.operationId, '');
    });

  });

  describe('should return the description of', () => {

    it('a class.', () => {
      class Controller {}

      const operation = getApiCompleteOperation(Controller, new Controller());
      strictEqual(operation.hasOwnProperty('description'), false);

      @ApiOperationDescription('')
      class Controller2 {}

      const operation2 = getApiCompleteOperation(Controller2, new Controller2());
      strictEqual(operation2.description, '');
    });

    it('a class method.', () => {
      class Controller {
        foo() {}
      }

      const operation = getApiCompleteOperation(Controller, new Controller(), 'foo');
      strictEqual(operation.hasOwnProperty('description'), false);

      class Controller2 {
        @ApiOperationDescription('')
        foo() {}
      }

      const operation2 = getApiCompleteOperation(Controller2, new Controller2(), 'foo');
      strictEqual(operation2.description, '');
    });

  });

  describe('should return the external documentation of', () => {

    it('a class.', () => {
      class Controller {}

      const operation = getApiCompleteOperation(Controller, new Controller());
      strictEqual(operation.hasOwnProperty('externalDocs'), false);

      const doc: IApiExternalDocumentation = {
        url: 'http://example.com/docs'
      };
      @ApiExternalDoc(doc)
      class Controller2 {}

      const operation2 = getApiCompleteOperation(Controller2, new Controller2());
      strictEqual(operation2.externalDocs, doc);
    });

    it('a class method.', () => {
      class Controller {
        foo() {}
      }

      const operation = getApiCompleteOperation(Controller, new Controller(), 'foo');
      strictEqual(operation.hasOwnProperty('externalDocs'), false);

      const doc: IApiExternalDocumentation = {
        url: 'http://example.com/docs'
      };
      class Controller2 {
        @ApiExternalDoc(doc)
        foo() {}
      }

      const operation2 = getApiCompleteOperation(Controller2, new Controller2(), 'foo');
      strictEqual(operation2.externalDocs, doc);
    });

  });

  describe('should return the operationId of', () => {

    it('a class method.', () => {
      class Controller {
        foo() {}
      }

      const operation = getApiCompleteOperation(Controller, new Controller(), 'foo');
      strictEqual(operation.hasOwnProperty('operationId'), false);

      class Controller3 {
        @ApiOperation({
          responses: {},
        })
        foo() {}
      }

      const operation3 = getApiCompleteOperation(Controller3, new Controller3(), 'foo');
      strictEqual(operation3.hasOwnProperty('operationId'), false);

      class Controller2 {
        @ApiOperation({
          operationId: 'foo1',
          responses: {},
        })
        foo() {}
      }

      const operation2 = getApiCompleteOperation(Controller2, new Controller2(), 'foo');
      strictEqual(operation2.operationId, 'foo1');
    });

  });

  describe('should return the parameters of', () => {

    it('a class.', () => {
      class Controller {}

      const operation = getApiCompleteOperation(Controller, new Controller());
      strictEqual(operation.hasOwnProperty('parameters'), false);

      const param: IApiParameter = {
        in: 'cookie',
        name: 'parameter1'
      };
      @ApiParameter(param)
      class Controller2 {}

      const operation2 = getApiCompleteOperation(Controller2, new Controller2());
      deepStrictEqual(operation2.parameters, [ param ]);
    });

    it('a class method.', () => {
      class Controller {
        foo() {}
      }

      const operation = getApiCompleteOperation(Controller, new Controller(), 'foo');
      strictEqual(operation.hasOwnProperty('parameters'), false);

      const param: IApiParameter = {
        in: 'cookie',
        name: 'parameter1'
      };
      class Controller2 {
        @ApiParameter(param)
        foo() {}
      }

      const operation2 = getApiCompleteOperation(Controller2, new Controller2(), 'foo');
      deepStrictEqual(operation2.parameters, [ param ]);
    });

  });

  describe('should return the request body of', () => {

    it('a class.', () => {
      class Controller {}

      const operation = getApiCompleteOperation(Controller, new Controller());
      strictEqual(operation.hasOwnProperty('requestBody'), false);

      const requestBody: IApiRequestBody = {
        content: {}
      };
      @ApiRequestBody(requestBody)
      class Controller2 {}

      const operation2 = getApiCompleteOperation(Controller2, new Controller2());
      strictEqual(operation2.requestBody, requestBody);
    });

    it('a class (dynamic request body).', () => {
      class Controller {}

      const operation = getApiCompleteOperation(Controller, new Controller());
      strictEqual(operation.hasOwnProperty('requestBody'), false);

      @ApiRequestBody((controller: Controller2) => controller.requestBody)
      class Controller2 {
        requestBody: IApiRequestBody = {
          content: {}
        };
      }

      const controller2 = new Controller2();
      const operation2 = getApiCompleteOperation(Controller2, controller2);
      strictEqual(operation2.requestBody, controller2.requestBody);
    });

    it('a class method.', () => {
      class Controller {
        foo() {}
      }

      const operation = getApiCompleteOperation(Controller, new Controller(), 'foo');
      strictEqual(operation.hasOwnProperty('requestBody'), false);

      const requestBody: IApiRequestBody = {
        content: {}
      };
      class Controller2 {
        @ApiRequestBody(requestBody)
        foo() {}
      }

      const operation2 = getApiCompleteOperation(Controller2, new Controller2(), 'foo');
      strictEqual(operation2.requestBody, requestBody);
    });

  });

  describe('should return the responses of', () => {

    it('a class.', () => {
      class Controller {}

      const operation = getApiCompleteOperation(Controller, new Controller());
      deepStrictEqual(operation.responses, {});

      const response: IApiResponse = {
        description: 'response1'
      };
      @ApiResponse(200, response)
      class Controller2 {}

      const operation2 = getApiCompleteOperation(Controller2, new Controller2());
      deepStrictEqual(operation2.responses, { 200: response });
    });

    it('a class method.', () => {
      class Controller {
        foo() {}
      }

      const operation = getApiCompleteOperation(Controller, new Controller(), 'foo');
      deepStrictEqual(operation.responses, {});

      const response: IApiResponse = {
        description: 'response1'
      };
      class Controller2 {
        @ApiResponse(200, response)
        foo() {}
      }

      const operation2 = getApiCompleteOperation(Controller2, new Controller2(), 'foo');
      deepStrictEqual(operation2.responses, { 200: response });
    });

  });

  describe('should return the callbacks of', () => {

    it('a class.', () => {
      class Controller {}

      const operation = getApiCompleteOperation(Controller, new Controller());
      strictEqual(operation.hasOwnProperty('callbacks'), false);

      const callback: IApiCallback = {};
      @ApiCallback('callback1', callback)
      class Controller2 {}

      const operation2 = getApiCompleteOperation(Controller2, new Controller2());
      deepStrictEqual(operation2.callbacks, {
        callback1: callback
      });
    });

    it('a class method.', () => {
      class Controller {
        foo() {}
      }

      const operation = getApiCompleteOperation(Controller, new Controller(), 'foo');
      strictEqual(operation.hasOwnProperty('callbacks'), false);

      const callback: IApiCallback = {};
      class Controller2 {
        @ApiCallback('callback1', callback)
        foo() {}
      }

      const operation2 = getApiCompleteOperation(Controller2, new Controller2(), 'foo');
      deepStrictEqual(operation2.callbacks, {
        callback1: callback
      });
    });

  });

  describe('should return the deprecated flag of', () => {

    it('a class.', () => {
      class Controller {}

      const operation = getApiCompleteOperation(Controller, new Controller());
      strictEqual(operation.hasOwnProperty('deprecated'), false);

      @ApiDeprecated(false)
      class Controller2 {}

      const operation2 = getApiCompleteOperation(Controller2, new Controller2());
      strictEqual(operation2.deprecated, false);
    });

    it('a class method.', () => {
      class Controller {
        foo() {}
      }

      const operation = getApiCompleteOperation(Controller, new Controller(), 'foo');
      strictEqual(operation.hasOwnProperty('deprecated'), false);

      class Controller2 {
        @ApiDeprecated(false)
        foo() {}
      }

      const operation2 = getApiCompleteOperation(Controller2, new Controller2(), 'foo');
      strictEqual(operation2.deprecated, false);
    });

  });

  describe('should return the security requirements of', () => {

    it('a class.', () => {
      class Controller {}

      const operation = getApiCompleteOperation(Controller, new Controller());
      strictEqual(operation.hasOwnProperty('security'), false);

      const securityRequirement: IApiSecurityRequirement = {};
      @ApiSecurityRequirement(securityRequirement)
      class Controller2 {}

      const operation2 = getApiCompleteOperation(Controller2, new Controller2());
      deepStrictEqual(operation2.security, [ securityRequirement ]);
    });

    it('a class method.', () => {
      class Controller {
        foo() {}
      }

      const operation = getApiCompleteOperation(Controller, new Controller(), 'foo');
      strictEqual(operation.hasOwnProperty('security'), false);

      const securityRequirement: IApiSecurityRequirement = {};
      class Controller2 {
        @ApiSecurityRequirement(securityRequirement)
        foo() {}
      }

      const operation2 = getApiCompleteOperation(Controller2, new Controller2(), 'foo');
      deepStrictEqual(operation2.security, [ securityRequirement ]);
    });

  });

  describe('should return the servers of', () => {

    it('a class.', () => {
      class Controller {}

      const operation = getApiCompleteOperation(Controller, new Controller());
      strictEqual(operation.hasOwnProperty('servers'), false);

      const server: IApiServer = {
        url: 'http://example.com'
      };
      @ApiServer(server)
      class Controller2 {}

      const operation2 = getApiCompleteOperation(Controller2, new Controller2());
      deepStrictEqual(operation2.servers, [ server ]);
    });

    it('a class method.', () => {
      class Controller {
        foo() {}
      }

      const operation = getApiCompleteOperation(Controller, new Controller(), 'foo');
      strictEqual(operation.hasOwnProperty('servers'), false);

      const server: IApiServer = {
        url: 'http://example.com'
      };
      class Controller2 {
        @ApiServer(server)
        foo() {}
      }

      const operation2 = getApiCompleteOperation(Controller2, new Controller2(), 'foo');
      deepStrictEqual(operation2.servers, [ server ]);
    });

  });

  it('should return the values of @ApiOperation.', () => {
    class Controller {
      @ApiOperation({
        callbacks: {
          a: { $ref: 'cb 1' }
        },
        deprecated: true,
        description: 'description 1',
        externalDocs: { url: 'http://example.com/docs' },
        operationId: 'foo 1',
        parameters: [
          { $ref: 'param 1' }
        ],
        requestBody: { $ref: 'body 1' },
        responses: {
          200: { $ref: '2' }
        },
        security: [ { a: ['security 1'] } ],
        servers: [ { url: 'http://example.com' }],
        summary: 'summary 1',
        tags: [ 'tag1' ],
      })

      foo() {}
    }

    const operation = getApiCompleteOperation(Controller, new Controller(), 'foo');
    deepStrictEqual(operation, {
      callbacks: {
        a: { $ref: 'cb 1' }
      },
      deprecated: true,
      description: 'description 1',
      externalDocs: { url: 'http://example.com/docs' },
      operationId: 'foo 1',
      parameters: [
        { $ref: 'param 1' }
      ],
      requestBody: { $ref: 'body 1' },
      responses: {
        200: { $ref: '2' }
      },
      security: [ { a: ['security 1'] } ],
      servers: [ { url: 'http://example.com' }],
      summary: 'summary 1',
      tags: [ 'tag1' ],
    });
  });

});
