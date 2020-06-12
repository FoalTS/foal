import { deepStrictEqual } from 'assert';
import { IApiOperation } from '../interfaces';
import { mergeOperations } from './merge-operations';

describe('mergeOperations', () => {

  describe('should merge the tags', () => {

    it('when operation1.tags is undefined and operation2.tags is not.', () => {
      const operation1: IApiOperation = {
        responses: {}
      };
      const operation2: IApiOperation = {
        responses: {},
        tags: [ 'tag1' ]
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        responses: {},
        tags: [ 'tag1' ]
      });
    });

    it('when operation2.tags is undefined and operation1.tags is not.', () => {
      const operation1: IApiOperation = {
        responses: {},
        tags: [ 'tag1' ]
      };
      const operation2: IApiOperation = {
        responses: {}
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        responses: {},
        tags: [ 'tag1' ]
      });
    });

    it('when both operation1.tags and operation2.tags are undefined.', () => {
      const operation1: IApiOperation = {
        responses: {}
      };
      const operation2: IApiOperation = {
        responses: {}
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        responses: {}
      });
    });

    it('when both operation1.tags and operation2.tags are defined.', () => {
      const operation1: IApiOperation = {
        responses: {},
        tags: [ 'tag1' ]
      };
      const operation2: IApiOperation = {
        responses: {},
        tags: [ 'tag2' ]
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        responses: {},
        tags: [ 'tag1', 'tag2' ]
      });
    });

  });

  describe('should merge the summary', () => {

    it('when operation1.summary is undefined and operation2.summary is not.', () => {
      const operation1: IApiOperation = {
        responses: {}
      };
      const operation2: IApiOperation = {
        responses: {},
        summary: '',
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        responses: {},
        summary: '',
      });
    });

    it('when operation2.summary is undefined and operation1.summary is not.', () => {
      const operation1: IApiOperation = {
        responses: {},
        summary: '',
      };
      const operation2: IApiOperation = {
        responses: {}
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        responses: {},
        summary: '',
      });
    });

    it('when both operation1.summary and operation2.summary are undefined.', () => {
      const operation1: IApiOperation = {
        responses: {}
      };
      const operation2: IApiOperation = {
        responses: {}
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        responses: {}
      });
    });

    it('when both operation1.summary and operation2.summary are defined.', () => {
      const operation1: IApiOperation = {
        responses: {},
        summary: '',
      };
      const operation2: IApiOperation = {
        responses: {},
        summary: 'a',
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        responses: {},
        summary: 'a',
      });
    });

  });

  describe('should merge the description', () => {

    it('when operation1.description is undefined and operation2.description is not.', () => {
      const operation1: IApiOperation = {
        responses: {}
      };
      const operation2: IApiOperation = {
        description: '',
        responses: {},
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        description: '',
        responses: {},
      });
    });

    it('when operation2.description is undefined and operation1.description is not.', () => {
      const operation1: IApiOperation = {
        description: '',
        responses: {},
      };
      const operation2: IApiOperation = {
        responses: {}
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        description: '',
        responses: {},
      });
    });

    it('when both operation1.description and operation2.description are undefined.', () => {
      const operation1: IApiOperation = {
        responses: {}
      };
      const operation2: IApiOperation = {
        responses: {}
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        responses: {}
      });
    });

    it('when both operation1.description and operation2.description are defined.', () => {
      const operation1: IApiOperation = {
        description: '',
        responses: {},
      };
      const operation2: IApiOperation = {
        description: 'a',
        responses: {},
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        description: 'a',
        responses: {},
      });
    });

  });

  describe('should merge the operationId', () => {

    it('when operation1.operationId is undefined and operation2.operationId is not.', () => {
      const operation1: IApiOperation = {
        responses: {}
      };
      const operation2: IApiOperation = {
        operationId: '',
        responses: {},
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        operationId: '',
        responses: {},
      });
    });

    it('when operation2.operationId is undefined and operation1.operationId is not.', () => {
      const operation1: IApiOperation = {
        operationId: '',
        responses: {},
      };
      const operation2: IApiOperation = {
        responses: {}
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        operationId: '',
        responses: {},
      });
    });

    it('when both operation1.operationId and operation2.operationId are undefined.', () => {
      const operation1: IApiOperation = {
        responses: {}
      };
      const operation2: IApiOperation = {
        responses: {}
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        responses: {}
      });
    });

    it('when both operation1.operationId and operation2.operationId are defined.', () => {
      const operation1: IApiOperation = {
        operationId: '',
        responses: {},
      };
      const operation2: IApiOperation = {
        operationId: 'a',
        responses: {},
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        operationId: 'a',
        responses: {},
      });
    });

  });

  describe('should merge the parameters', () => {

    it('when operation1.parameters is undefined and operation2.parameters is not.', () => {
      const operation1: IApiOperation = {
        responses: {}
      };
      const operation2: IApiOperation = {
        parameters: [
          {
            in: 'cookie',
            name: 'param1'
          }
        ],
        responses: {},
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        parameters: [
          {
            in: 'cookie',
            name: 'param1'
          }
        ],
        responses: {},
      });
    });

    it('when operation2.parameters is undefined and operation1.parameters is not.', () => {
      const operation1: IApiOperation = {
        parameters: [
          {
            in: 'cookie',
            name: 'param1'
          }
        ],
        responses: {},
      };
      const operation2: IApiOperation = {
        responses: {}
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        parameters: [
          {
            in: 'cookie',
            name: 'param1'
          }
        ],
        responses: {},
      });
    });

    it('when both operation1.parameters and operation2.parameters are undefined.', () => {
      const operation1: IApiOperation = {
        responses: {}
      };
      const operation2: IApiOperation = {
        responses: {}
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        responses: {}
      });
    });

    it('when both operation1.parameters and operation2.parameters are defined.', () => {
      const operation1: IApiOperation = {
        parameters: [
          {
            in: 'cookie',
            name: 'param1'
          }
        ],
        responses: {},
      };
      const operation2: IApiOperation = {
        parameters: [
          {
            in: 'cookie',
            name: 'param2'
          }
        ],
        responses: {},
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        parameters: [
          {
            in: 'cookie',
            name: 'param1'
          },
          {
            in: 'cookie',
            name: 'param2'
          }
        ],
        responses: {},
      });
    });

  });

  describe('should merge the requestBody', () => {

    it('when operation1.requestBody is undefined and operation2.requestBody is not.', () => {
      const operation1: IApiOperation = {
        responses: {}
      };
      const operation2: IApiOperation = {
        requestBody: {
          content: {},
          description: '1'
        },
        responses: {},
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        requestBody: {
          content: {},
          description: '1'
        },
        responses: {},
      });
    });

    it('when operation2.requestBody is undefined and operation1.requestBody is not.', () => {
      const operation1: IApiOperation = {
        requestBody: {
          content: {},
          description: '1'
        },
        responses: {},
      };
      const operation2: IApiOperation = {
        responses: {}
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        requestBody: {
          content: {},
          description: '1'
        },
        responses: {},
      });
    });

    it('when both operation1.requestBody and operation2.requestBody are undefined.', () => {
      const operation1: IApiOperation = {
        responses: {}
      };
      const operation2: IApiOperation = {
        responses: {}
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        responses: {}
      });
    });

    it('when both operation1.requestBody and operation2.requestBody are defined.', () => {
      const operation1: IApiOperation = {
        requestBody: {
          content: {},
          description: '1'
        },
        responses: {},
      };
      const operation2: IApiOperation = {
        requestBody: {
          content: {},
          description: '2'
        },
        responses: {},
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        requestBody: {
          content: {},
          description: '2'
        },
        responses: {},
      });
    });

  });

  it('should merge the responses.', () => {
    const operation1: IApiOperation = {
      responses: {
        200: {
          $ref: '1'
        },
        201: {
          $ref: '2'
        }
      },
    };
    const operation2: IApiOperation = {
      responses: {
        201: {
          $ref: '3'
        }
      },
    };

    const operation = mergeOperations(operation1, operation2);

    deepStrictEqual(operation, {
      responses: {
        200: {
          $ref: '1'
        },
        201: {
          $ref: '3'
        }
      },
    });
  });

  describe('should merge the callbacks', () => {

    it('when operation1.callbacks is undefined and operation2.callbacks is not.', () => {
      const operation1: IApiOperation = {
        responses: {}
      };
      const operation2: IApiOperation = {
        callbacks: {
          a: { $ref: '1' }
        },
        responses: {},
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        callbacks: {
          a: { $ref: '1' }
        },
        responses: {},
      });
    });

    it('when operation2.callbacks is undefined and operation1.callbacks is not.', () => {
      const operation1: IApiOperation = {
        callbacks: {
          a: { $ref: '1' }
        },
        responses: {},
      };
      const operation2: IApiOperation = {
        responses: {}
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        callbacks: {
          a: { $ref: '1' }
        },
        responses: {},
      });
    });

    it('when both operation1.callbacks and operation2.callbacks are undefined.', () => {
      const operation1: IApiOperation = {
        responses: {}
      };
      const operation2: IApiOperation = {
        responses: {}
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        responses: {}
      });
    });

    it('when both operation1.callbacks and operation2.callbacks are defined.', () => {
      const operation1: IApiOperation = {
        callbacks: {
          a: { $ref: '1' },
          b: { $ref: '2' }
        },
        responses: {},
      };
      const operation2: IApiOperation = {
        callbacks: {
          a: { $ref: '3' }
        },
        responses: {},
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        callbacks: {
          a: { $ref: '3' },
          b: { $ref: '2' }
        },
        responses: {},
      });
    });

  });

  describe('should merge the deprecated flag', () => {

    it('when operation1.deprecated is undefined and operation2.deprecated is not.', () => {
      const operation1: IApiOperation = {
        responses: {}
      };
      const operation2: IApiOperation = {
        deprecated: false,
        responses: {},
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        deprecated: false,
        responses: {},
      });
    });

    it('when operation2.deprecated is undefined and operation1.deprecated is not.', () => {
      const operation1: IApiOperation = {
        deprecated: false,
        responses: {},
      };
      const operation2: IApiOperation = {
        responses: {}
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        deprecated: false,
        responses: {},
      });
    });

    it('when both operation1.deprecated and operation2.deprecated are undefined.', () => {
      const operation1: IApiOperation = {
        responses: {}
      };
      const operation2: IApiOperation = {
        responses: {}
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        responses: {}
      });
    });

    it('when both operation1.deprecated and operation2.deprecated are defined.', () => {
      const operation1: IApiOperation = {
        deprecated: true,
        responses: {},
      };
      const operation2: IApiOperation = {
        deprecated: false,
        responses: {},
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        deprecated: false,
        responses: {},
      });
    });

  });

  describe('should merge the externalDocs', () => {

    it('when operation1.externalDocs is undefined and operation2.externalDocs is not.', () => {
      const operation1: IApiOperation = {
        responses: {}
      };
      const operation2: IApiOperation = {
        externalDocs: {
          url: 'http://example.com/docs'
        },
        responses: {},
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        externalDocs: {
          url: 'http://example.com/docs'
        },
        responses: {},
      });
    });

    it('when operation2.externalDocs is undefined and operation1.externalDocs is not.', () => {
      const operation1: IApiOperation = {
        externalDocs: {
          url: 'http://example.com/docs'
        },
        responses: {},
      };
      const operation2: IApiOperation = {
        responses: {}
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        externalDocs: {
          url: 'http://example.com/docs'
        },
        responses: {},
      });
    });

    it('when both operation1.externalDocs and operation2.externalDocs are undefined.', () => {
      const operation1: IApiOperation = {
        responses: {}
      };
      const operation2: IApiOperation = {
        responses: {}
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        responses: {}
      });
    });

    it('when both operation1.externalDocs and operation2.externalDocs are defined.', () => {
      const operation1: IApiOperation = {
        externalDocs: {
          url: 'http://example.com/docs'
        },
        responses: {},
      };
      const operation2: IApiOperation = {
        externalDocs: {
          url: 'http://example2.com/docs'
        },
        responses: {},
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        externalDocs: {
          url: 'http://example2.com/docs'
        },
        responses: {},
      });
    });

  });

  describe('should merge the security requirements', () => {

    it('when operation1.security is undefined and operation2.security is not.', () => {
      const operation1: IApiOperation = {
        responses: {}
      };
      const operation2: IApiOperation = {
        responses: {},
        security: [
          {
            a: [ 'a1' ]
          }
        ],
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        responses: {},
        security: [
          {
            a: [ 'a1' ]
          }
        ],
      });
    });

    it('when operation2.security is undefined and operation1.security is not.', () => {
      const operation1: IApiOperation = {
        responses: {},
        security: [
          {
            a: [ 'a1' ]
          }
        ],
      };
      const operation2: IApiOperation = {
        responses: {}
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        responses: {},
        security: [
          {
            a: [ 'a1' ]
          }
        ],
      });
    });

    it('when both operation1.security and operation2.security are undefined.', () => {
      const operation1: IApiOperation = {
        responses: {}
      };
      const operation2: IApiOperation = {
        responses: {}
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        responses: {}
      });
    });

    it('when both operation1.security and operation2.security are defined.', () => {
      const operation1: IApiOperation = {
        responses: {},
        security: [
          {
            a: [ 'a1' ]
          }
        ],
      };
      const operation2: IApiOperation = {
        responses: {},
        security: [
          {
            b: [ 'b1' ]
          }
        ],
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        responses: {},
        security: [
          {
            a: [ 'a1' ]
          },
          {
            b: [ 'b1' ]
          }
        ],
      });
    });

  });

  describe('should merge the servers', () => {

    it('when operation1.servers is undefined and operation2.servers is not.', () => {
      const operation1: IApiOperation = {
        responses: {}
      };
      const operation2: IApiOperation = {
        responses: {},
        servers: [
          {
            url: 'http://example.com'
          }
        ],
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        responses: {},
        servers: [
          {
            url: 'http://example.com'
          }
        ],
      });
    });

    it('when operation2.servers is undefined and operation1.servers is not.', () => {
      const operation1: IApiOperation = {
        responses: {},
        servers: [
          {
            url: 'http://example.com'
          }
        ],
      };
      const operation2: IApiOperation = {
        responses: {}
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        responses: {},
        servers: [
          {
            url: 'http://example.com'
          }
        ],
      });
    });

    it('when both operation1.servers and operation2.servers are undefined.', () => {
      const operation1: IApiOperation = {
        responses: {}
      };
      const operation2: IApiOperation = {
        responses: {}
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        responses: {}
      });
    });

    it('when both operation1.servers and operation2.servers are defined.', () => {
      const operation1: IApiOperation = {
        responses: {},
        servers: [
          {
            url: 'http://example.com'
          }
        ],
      };
      const operation2: IApiOperation = {
        responses: {},
        servers: [
          {
            url: 'http://example2.com'
          }
        ],
      };

      const operation = mergeOperations(operation1, operation2);

      deepStrictEqual(operation, {
        responses: {},
        servers: [
          {
            url: 'http://example.com'
          },
          {
            url: 'http://example2.com'
          }
        ],
      });
    });

  });

});
