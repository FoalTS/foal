// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import { getMetadata } from '../routes/utils';
import {
  ApiCallback, ApiDefineCallback, ApiDefineExample, ApiDefineHeader,
  ApiDefineLink, ApiDefineParameter, ApiDefineRequestBody, ApiDefineResponse,
  ApiDefineSchema, ApiDefineSecurityScheme, ApiDefineTag, ApiDeprecated,
  ApiExternalDoc, ApiInfo, ApiOperation, ApiOperationDescription, ApiOperationId,
  ApiOperationSummary, ApiParameter, ApiRequestBody, ApiResponse, ApiSecurityRequirement, ApiServer, ApiUseTag
} from './decorators';
import {
  IApiCallback, IApiExample, IApiExternalDocumentation,
  IApiHeader, IApiInfo, IApiLink, IApiOperation, IApiParameter,
  IApiRequestBody, IApiResponse, IApiSchema, IApiSecurityRequirement,
  IApiSecurityScheme, IApiServer, IApiTag
} from './interfaces';

describe('ApiInfo', () => {

  it('should define the correct metadata.', () => {
    const metadata: IApiInfo = {
      contact: {
        email: 'support@example.com',
        name: 'API Support',
        url: 'http://www.example.com/support',
      },
      description: 'This is a sample server for a pet store.',
      license: {
        name: 'Apache 2.0',
        url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
      },
      termsOfService: 'http://example.com/terms/',
      title: 'Sample Pet Store App',
      version: '1.0.1'
    };

    @ApiInfo(metadata)
    class Controller { }

    strictEqual(getMetadata('api:document:info', Controller), metadata);
  });

  it('should define the correct metadata (dynamic).', () => {
    const metadata: IApiInfo = {
      contact: {
        email: 'support@example.com',
        name: 'API Support',
        url: 'http://www.example.com/support',
      },
      description: 'This is a sample server for a pet store.',
      license: {
        name: 'Apache 2.0',
        url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
      },
      termsOfService: 'http://example.com/terms/',
      title: 'Sample Pet Store App',
      version: '1.0.1'
    };
    const metadataFunc = (controller: any) => metadata;

    @ApiInfo(metadataFunc)
    class Controller { }

    strictEqual(getMetadata('api:document:info', Controller), metadataFunc);
  });

});

describe('ApiOperationDescription', () => {

  const metadata: string = 'Returns pets based on ID';

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiOperationDescription(metadata)
      foo() { }
    }
    deepStrictEqual(getMetadata('api:operation:description', Controller, 'foo'), 'Returns pets based on ID');
  });

  it('should define the correct metadata (method & dynamic).', () => {
    const metadataFunc = (controller: any) => metadata;
    class Controller {
      @ApiOperationDescription(metadataFunc)
      foo() { }
    }
    deepStrictEqual(getMetadata('api:operation:description', Controller, 'foo'), metadataFunc);
  });

});

describe('ApiOperationId', () => {

  const metadata: string = 'updatePet';

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiOperationId(metadata)
      foo() { }
    }
    deepStrictEqual(getMetadata('api:operation:operationId', Controller, 'foo'), 'updatePet');
  });

  it('should define the correct metadata (method & dynamic).', () => {
    const metadataFunc = (controller: any) => metadata;
    class Controller {
      @ApiOperationId(metadataFunc)
      foo() { }
    }
    deepStrictEqual(getMetadata('api:operation:operationId', Controller, 'foo'), metadataFunc);
  });

});

describe('ApiOperationSummary', () => {

  const metadata: string = 'Find pets by ID';

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiOperationSummary(metadata)
      foo() { }
    }
    deepStrictEqual(getMetadata('api:operation:summary', Controller, 'foo'), 'Find pets by ID');
  });

  it('should define the correct metadata (method & dynamic).', () => {
    const metadataFunc = (controller: any) => metadata;
    class Controller {
      @ApiOperationSummary(metadataFunc)
      foo() { }
    }
    deepStrictEqual(getMetadata('api:operation:summary', Controller, 'foo'), metadataFunc);
  });

});

describe('ApiServer', () => {

  const metadata: IApiServer = {
    description: 'Development server',
    url: 'https://development.gigantic-server.com/v1',
  };
  const metadata2: IApiServer = {
    description: 'Staging server',
    url: 'https://staging.gigantic-server.com/v1',
  };

  it('should define the correct metadata (class).', () => {
    @ApiServer(metadata)
    class Controller { }
    deepStrictEqual(getMetadata('api:documentOrOperation:servers', Controller), [metadata]);

    @ApiServer(metadata)
    @ApiServer(metadata2)
    class Controller2 { }
    deepStrictEqual(getMetadata('api:documentOrOperation:servers', Controller2), [metadata, metadata2]);
  });

  it('should define the correct metadata (class & dynamic).', () => {
    const metadataFunc = (controller: any) => metadata;
    @ApiServer(metadataFunc)
    class Controller { }
    deepStrictEqual(getMetadata('api:documentOrOperation:servers', Controller), [metadataFunc]);
  });

  it('should define the correct metadata (class & inheritance).', () => {
    @ApiServer(metadata)
    class Controller { }
    deepStrictEqual(getMetadata('api:documentOrOperation:servers', Controller), [metadata]);

    @ApiServer(metadata2)
    class Controller2 extends Controller { }
    deepStrictEqual(getMetadata('api:documentOrOperation:servers', Controller), [metadata]);
    deepStrictEqual(getMetadata('api:documentOrOperation:servers', Controller2), [metadata2, metadata]);
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiServer(metadata)
      foo() { }
    }
    deepStrictEqual(getMetadata('api:documentOrOperation:servers', Controller, 'foo'), [metadata]);

    class Controller2 {
      @ApiServer(metadata)
      @ApiServer(metadata2)
      foo() { }
    }
    deepStrictEqual(getMetadata('api:documentOrOperation:servers', Controller2, 'foo'), [metadata, metadata2]);
  });

});

describe('ApiSecurityRequirement', () => {
  const metadata: IApiSecurityRequirement = {
    api_key: []
  };
  const metadata2: IApiSecurityRequirement = {
    petstore_auth: [
      'write:pets',
      'read:pets'
    ]
  };

  it('should define the correct metadata (class).', () => {
    @ApiSecurityRequirement(metadata)
    class Controller { }
    deepStrictEqual(getMetadata('api:documentOrOperation:security', Controller), [metadata]);

    @ApiSecurityRequirement(metadata)
    @ApiSecurityRequirement(metadata2)
    class Controller2 { }
    deepStrictEqual(getMetadata('api:documentOrOperation:security', Controller2), [metadata, metadata2]);
  });

  it('should define the correct metadata (class & dynamic).', () => {
    const metadataFunc = (controller: any) => metadata;

    @ApiSecurityRequirement(metadataFunc)
    class Controller { }
    deepStrictEqual(getMetadata('api:documentOrOperation:security', Controller), [metadataFunc]);
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiSecurityRequirement(metadata)
      foo() { }
    }
    deepStrictEqual(getMetadata('api:documentOrOperation:security', Controller, 'foo'), [metadata]);

    class Controller2 {
      @ApiSecurityRequirement(metadata)
      @ApiSecurityRequirement(metadata2)
      foo() { }
    }
    deepStrictEqual(getMetadata('api:documentOrOperation:security', Controller2, 'foo'), [metadata, metadata2]);
  });

});

describe('ApiDefineTag', () => {

  const metadata: IApiTag = {
    description: 'Pets operations',
    name: 'pet',
  };
  const metadata2: IApiTag = {
    description: 'Pets operations',
    name: 'pet2',
  };

  it('should define the correct metadata (class).', () => {
    @ApiDefineTag(metadata)
    class Controller { }
    deepStrictEqual(getMetadata('api:document:tags', Controller), [metadata]);

    @ApiDefineTag(metadata)
    @ApiDefineTag(metadata2)
    class Controller2 { }
    deepStrictEqual(getMetadata('api:document:tags', Controller2), [metadata, metadata2]);
  });

  it('should define the correct metadata (class & dynamic).', () => {
    const metadataFunc = (controller: any) => metadata;
    @ApiDefineTag(metadataFunc)
    class Controller { }
    deepStrictEqual(getMetadata('api:document:tags', Controller), [metadataFunc]);
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiDefineTag(metadata)
      foo() { }
    }
    deepStrictEqual(getMetadata('api:document:tags', Controller, 'foo'), [metadata]);

    class Controller2 {
      @ApiDefineTag(metadata)
      @ApiDefineTag(metadata2)
      foo() { }
    }
    deepStrictEqual(getMetadata('api:document:tags', Controller2, 'foo'), [metadata, metadata2]);
  });

});

describe('ApiExternalDoc', () => {

  const metadata: IApiExternalDocumentation = {
    description: 'Find more info here',
    url: 'https://example.com',
  };

  it('should define the correct metadata (class).', () => {
    @ApiExternalDoc(metadata)
    class Controller { }

    strictEqual(getMetadata('api:documentOrOperation:externalDocs', Controller), metadata);
  });

  it('should define the correct metadata (class & dynamic).', () => {
    const metadataFunc = (controller: any) => metadata;
    @ApiExternalDoc(metadataFunc)
    class Controller { }

    strictEqual(getMetadata('api:documentOrOperation:externalDocs', Controller), metadataFunc);
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiExternalDoc(metadata)
      foo() { }
    }

    strictEqual(getMetadata('api:documentOrOperation:externalDocs', Controller, 'foo'), metadata);
  });

});

describe('ApiOperation', () => {

  const metadata: IApiOperation = {
    operationId: 'updatePetWithForm',
    parameters: [
      {
        description: 'ID of pet that needs to be updated',
        in: 'path',
        name: 'petId',
        required: true,
        schema: {
          type: 'string'
        }
      }
    ],
    requestBody: {
      content: {
        'application/x-www-form-urlencoded': {
          schema: {
            properties: {
              name: {
                description: 'Updated name of the pet',
                type: 'string'
              },
              status: {
                description: 'Updated status of the pet',
                type: 'string'
              }
            },
            required: ['status'],
            type: 'object',
          }
        }
      }
    },
    responses: {
      200: {
        content: {
          'application/json': {},
          'application/xml': {}
        },
        description: 'Pet updated.',
      },
      405: {
        content: {
          'application/json': {},
          'application/xml': {}
        },
        description: 'Method Not Allowed',
      }
    },
    security: [
      {
        petstore_auth: [
          'write:pets',
          'read:pets'
        ]
      }
    ],
    summary: 'Updates a pet in the store with form data',
    tags: [
      'pet'
    ],
  };

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiOperation(metadata)
      foo() { }
    }

    strictEqual(getMetadata('api:operation', Controller, 'foo'), metadata);
  });

  it('should define the correct metadata (method & dynamic).', () => {
    const metadataFunc = (controller: any) => metadata;
    class Controller {
      @ApiOperation(metadataFunc)
      foo() { }
    }

    strictEqual(getMetadata('api:operation', Controller, 'foo'), metadataFunc);
  });

});

describe('ApiUseTag', () => {

  const metadata: string = 'tag1';
  const metadata2: string = 'tag2';

  it('should define the correct metadata (class).', () => {
    @ApiUseTag(metadata)
    class Controller { }
    deepStrictEqual(getMetadata('api:operation:tags', Controller), [metadata]);

    @ApiUseTag(metadata)
    @ApiUseTag(metadata2)
    class Controller2 { }
    deepStrictEqual(getMetadata('api:operation:tags', Controller2), [metadata, metadata2]);
  });

  it('should define the correct metadata (class).', () => {
    const metadataFunc = (controller: any) => metadata;
    @ApiUseTag(metadataFunc)
    class Controller { }
    deepStrictEqual(getMetadata('api:operation:tags', Controller), [metadataFunc]);
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiUseTag(metadata)
      foo() { }
    }
    deepStrictEqual(getMetadata('api:operation:tags', Controller, 'foo'), [metadata]);

    class Controller2 {
      @ApiUseTag(metadata)
      @ApiUseTag(metadata2)
      foo() { }
    }
    deepStrictEqual(getMetadata('api:operation:tags', Controller2, 'foo'), [metadata, metadata2]);
  });

});

describe('ApiParameter', () => {

  const metadata: IApiParameter = {
    description: 'ID of pet that needs to be updated',
    in: 'path',
    name: 'petId',
    required: true,
    schema: {
      type: 'string'
    }
  };
  const metadata2: IApiParameter = {
    description: 'token to be passed as a header',
    in: 'header',
    name: 'token',
    required: true,
    schema: {
      items: {
        format: 'int64',
        type: 'integer',
      },
      type: 'array',
    },
    style: 'simple'
  };

  it('should define the correct metadata (class).', () => {
    @ApiParameter(metadata)
    class Controller { }
    deepStrictEqual(getMetadata('api:operation:parameters', Controller), [metadata]);

    @ApiParameter(metadata)
    @ApiParameter(metadata2)
    class Controller2 { }
    deepStrictEqual(getMetadata('api:operation:parameters', Controller2), [metadata, metadata2]);
  });

  it('should define the correct metadata (class & dynamic).', () => {
    const metadataFunc = (controller: any) => metadata;
    @ApiParameter(metadataFunc)
    class Controller { }
    deepStrictEqual(getMetadata('api:operation:parameters', Controller), [metadataFunc]);
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiParameter(metadata)
      foo() { }
    }
    deepStrictEqual(getMetadata('api:operation:parameters', Controller, 'foo'), [metadata]);

    class Controller2 {
      @ApiParameter(metadata)
      @ApiParameter(metadata2)
      foo() { }
    }
    deepStrictEqual(getMetadata('api:operation:parameters', Controller2, 'foo'), [metadata, metadata2]);
  });

});

describe('ApiRequestBody', () => {

  const metadata: IApiRequestBody = {
    content: {
      '*/*': {
        examples: {
          user : {
            externalValue: 'http://foo.bar/examples/user-example.whatever',
              summary: 'User example in other format',
          }
        }
      },
      'application/json': {
        examples: {
          user : {
            externalValue: 'http://foo.bar/examples/user-example.json',
            summary: 'User Example',
          }
        },
        schema: {
          $ref: '#/components/schemas/User'
        },
      },
      'application/xml': {
        examples: {
          user : {
            externalValue: 'http://foo.bar/examples/user-example.xml',
            summary: 'User example in XML',
          }
        },
        schema: {
          $ref: '#/components/schemas/User'
        },
      },
      'text/plain': {
        examples: {
          user : {
            externalValue: 'http://foo.bar/examples/user-example.txt',
              summary: 'User example in Plain text',
          }
        }
      },
    },
    description: 'user to add to the system',
  };

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiRequestBody(metadata)
      foo() { }
    }

    strictEqual(getMetadata('api:operation:requestBody', Controller, 'foo'), metadata);
  });

  it('should define the correct metadata (method & dynamic metadata).', () => {
    const metadataFunc = (controller: any) => metadata;
    class Controller {
      @ApiRequestBody(metadataFunc)
      foo() { }
    }

    strictEqual(getMetadata('api:operation:requestBody', Controller, 'foo'), metadataFunc);
  });

});

describe('ApiResponse', () => {
  const metadata: IApiResponse = {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/GeneralError'
        }
      }
    },
    description: 'General Error',
  };
  const metadata2: IApiResponse = {
    description: 'Entity not found.'
  };

  it('should define the correct metadata (class).', () => {
    @ApiResponse('default', metadata)
    @ApiResponse(404, metadata2)
    class Controller {}

    deepStrictEqual(getMetadata('api:operation:responses', Controller), {
      default: metadata,
      404: metadata2
    });
  });

  it('should define the correct metadata (class & dynamic).', () => {
    const metadataFunc = (controller: any) => metadata;
    @ApiResponse('default', metadataFunc)
    class Controller {}

    deepStrictEqual(getMetadata('api:operation:responses', Controller), {
      default: metadataFunc,
    });

  });

  it('should define the correct metadata (class & inheritance).', () => {
    @ApiResponse('default', metadata)
    class Controller {}
    deepStrictEqual(getMetadata('api:operation:responses', Controller), {
      default: metadata,
    });

    @ApiResponse(404, metadata2)
    class Controller2 extends Controller {}
    deepStrictEqual(getMetadata('api:operation:responses', Controller), {
      default: metadata
    });
    deepStrictEqual(getMetadata('api:operation:responses', Controller2), {
      default: metadata,
      404: metadata2
    });
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiResponse('default', metadata)
      @ApiResponse(404, metadata2)
      foo() { }
    }

    deepStrictEqual(getMetadata('api:operation:responses', Controller, 'foo'), {
      default: metadata,
      404: metadata2
    });
  });

});

describe('ApiCallback', () => {

  const metadata: IApiCallback = {};
  const metadata2: IApiCallback = {};

  it('should define the correct metadata (class).', () => {
    @ApiCallback('callback1', metadata)
    @ApiCallback('callback2', metadata2)
    class Controller {}

    deepStrictEqual(getMetadata('api:operation:callbacks', Controller), {
      callback1: metadata,
      callback2: metadata2
    });
  });

  it('should define the correct metadata (class & dynamic).', () => {
    const metadataFunc = (controller: any) => metadata;
    @ApiCallback('callback1', metadataFunc)
    class Controller {}

    deepStrictEqual(getMetadata('api:operation:callbacks', Controller), {
      callback1: metadataFunc,
    });
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiCallback('callback1', metadata)
      @ApiCallback('callback2', metadata2)
      foo() { }
    }

    deepStrictEqual(getMetadata('api:operation:callbacks', Controller, 'foo'), {
      callback1: metadata,
      callback2: metadata2
    });
  });

});

describe('ApiDeprecated', () => {

  const metadata: boolean = true;

  it('should define the correct metadata (class).', () => {
    @ApiDeprecated(metadata)
    class Controller {}

    strictEqual(getMetadata('api:operation:deprecated', Controller), metadata);
  });

  it('should define the correct metadata (class & dynamic).', () => {
    const metadataFunc = (controller: any) => metadata;
    @ApiDeprecated(metadataFunc)
    class Controller {}

    strictEqual(getMetadata('api:operation:deprecated', Controller), metadataFunc);
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiDeprecated(metadata)
      foo() { }
    }

    strictEqual(getMetadata('api:operation:deprecated', Controller, 'foo'), metadata);
  });

});

/* Components */

describe('ApiDefineSchema', () => {

  const metadata: IApiSchema = {
    properties: {
      address: {
        $ref: '#/components/schemas/Address'
      },
      name: {
        type: 'string'
      }
    },
    required: [
      'name'
    ],
    type: 'object',
  };
  const metadata2: IApiSchema = {};

  it('should define the correct metadata (class).', () => {
    @ApiDefineSchema('schema1', metadata)
    @ApiDefineSchema('schema2', metadata2)
    class Controller {}

    deepStrictEqual(getMetadata('api:components:schemas', Controller), {
      schema1: metadata,
      schema2: metadata2
    });
  });

  it('should define the correct metadata (class & dynamic).', () => {
    const metadataFunc = (controller: any) => metadata;
    @ApiDefineSchema('schema1', metadataFunc)
    class Controller {}

    deepStrictEqual(getMetadata('api:components:schemas', Controller), {
      schema1: metadataFunc,
    });
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiDefineSchema('schema1', metadata)
      @ApiDefineSchema('schema2', metadata2)
      foo() { }
    }

    deepStrictEqual(getMetadata('api:components:schemas', Controller, 'foo'), {
      schema1: metadata,
      schema2: metadata2
    });
  });

});

describe('ApiDefineResponse', () => {

  const metadata: IApiResponse = {
    content: {
      'application/json': {
        schema: {
          items: {
            $ref: '#/components/schemas/VeryComplexType'
          },
          type: 'array',
        }
      }
    },
    description: 'A complex object array response',
  };
  const metadata2: IApiResponse = {
    content: {
      'text/plain': {
        schema: {
          type: 'string'
        }
      }
    },
    description: 'A simple string response',
  };

  it('should define the correct metadata (class).', () => {
    @ApiDefineResponse('response1', metadata)
    @ApiDefineResponse('response2', metadata2)
    class Controller {}

    deepStrictEqual(getMetadata('api:components:responses', Controller), {
      response1: metadata,
      response2: metadata2
    });
  });

  it('should define the correct metadata (class & dynamic).', () => {
    const metadataFunc = (controller: any) => metadata;
    @ApiDefineResponse('response1', metadataFunc)
    class Controller {}

    deepStrictEqual(getMetadata('api:components:responses', Controller), {
      response1: metadataFunc,
    });
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiDefineResponse('response1', metadata)
      @ApiDefineResponse('response2', metadata2)
      foo() { }
    }

    deepStrictEqual(getMetadata('api:components:responses', Controller, 'foo'), {
      response1: metadata,
      response2: metadata2
    });
  });

});

describe('ApiDefineParameter', () => {

  const metadata: IApiParameter = {
    description: 'token to be passed as a header',
    in: 'header',
    name: 'token',
    required: true,
    schema: {
      items: {
        format: 'int64',
        type: 'integer',
      },
      type: 'array',
    },
    style: 'simple'
  };
  const metadata2: IApiParameter = {
    description: 'username to fetch',
    in: 'path',
    name: 'username',
    required: true,
    schema: {
      type: 'string'
    }
  };

  it('should define the correct metadata (class).', () => {
    @ApiDefineParameter('parameter1', metadata)
    @ApiDefineParameter('parameter2', metadata2)
    class Controller {}

    deepStrictEqual(getMetadata('api:components:parameters', Controller), {
      parameter1: metadata,
      parameter2: metadata2
    });
  });

  it('should define the correct metadata (class).', () => {
    const metadataFunc = (controller: any) => metadata;
    @ApiDefineParameter('parameter1', metadataFunc)
    class Controller {}

    deepStrictEqual(getMetadata('api:components:parameters', Controller), {
      parameter1: metadataFunc,
    });
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiDefineParameter('parameter1', metadata)
      @ApiDefineParameter('parameter2', metadata2)
      foo() { }
    }

    deepStrictEqual(getMetadata('api:components:parameters', Controller, 'foo'), {
      parameter1: metadata,
      parameter2: metadata2
    });
  });

});

describe('ApiDefineExample', () => {

  const metadata: IApiExample = {};
  const metadata2: IApiExample = {};

  it('should define the correct metadata (class).', () => {
    @ApiDefineExample('example1', metadata)
    @ApiDefineExample('example2', metadata2)
    class Controller {}

    deepStrictEqual(getMetadata('api:components:examples', Controller), {
      example1: metadata,
      example2: metadata2
    });
  });

  it('should define the correct metadata (class & dynamic).', () => {
    const metadataFunc = (controller: any) => metadata;
    @ApiDefineExample('example1', metadataFunc)
    class Controller {}

    deepStrictEqual(getMetadata('api:components:examples', Controller), {
      example1: metadataFunc,
    });
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiDefineExample('example1', metadata)
      @ApiDefineExample('example2', metadata2)
      foo() { }
    }

    deepStrictEqual(getMetadata('api:components:examples', Controller, 'foo'), {
      example1: metadata,
      example2: metadata2
    });
  });

});

describe('ApiDefineRequestBody', () => {

  const metadata: IApiRequestBody = {
    content: {
      '*/*': {
        examples: {
          user : {
            externalValue: 'http://foo.bar/examples/user-example.whatever',
              summary: 'User example in other format',
          }
        }
      },
      'application/json': {
        examples: {
          user : {
            externalValue: 'http://foo.bar/examples/user-example.json',
            summary: 'User Example',
          }
        },
        schema: {
          $ref: '#/components/schemas/User'
        },
      },
      'application/xml': {
        examples: {
          user : {
            externalValue: 'http://foo.bar/examples/user-example.xml',
            summary: 'User example in XML',
          }
        },
        schema: {
          $ref: '#/components/schemas/User'
        },
      },
      'text/plain': {
        examples: {
          user : {
            externalValue: 'http://foo.bar/examples/user-example.txt',
              summary: 'User example in Plain text',
          }
        }
      },
    },
    description: 'user to add to the system',
  };
  const metadata2: IApiRequestBody = {
    content: {
      'text/plain': {
        schema: {
          items: {
            type: 'string'
          },
          type: 'array',
        }
      }
    },
    description: 'user to add to the system',
  };

  it('should define the correct metadata (class).', () => {
    @ApiDefineRequestBody('requestBody1', metadata)
    @ApiDefineRequestBody('requestBody2', metadata2)
    class Controller {}

    deepStrictEqual(getMetadata('api:components:requestBodies', Controller), {
      requestBody1: metadata,
      requestBody2: metadata2
    });
  });

  it('should define the correct metadata (class & dynamic).', () => {
    const metadataFunc = (controller: any) => metadata;
    @ApiDefineRequestBody('requestBody1', metadataFunc)
    class Controller {}

    deepStrictEqual(getMetadata('api:components:requestBodies', Controller), {
      requestBody1: metadataFunc,
    });
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiDefineRequestBody('requestBody1', metadata)
      @ApiDefineRequestBody('requestBody2', metadata2)
      foo() { }
    }

    deepStrictEqual(getMetadata('api:components:requestBodies', Controller, 'foo'), {
      requestBody1: metadata,
      requestBody2: metadata2
    });
  });

});

describe('ApiDefineHeader', () => {

  const metadata: IApiHeader = {
    description: 'The number of allowed requests in the current period',
    schema: {
      type: 'integer'
    },
  };
  const metadata2: IApiHeader = {};

  it('should define the correct metadata (class).', () => {
    @ApiDefineHeader('header1', metadata)
    @ApiDefineHeader('header2', metadata2)
    class Controller {}

    deepStrictEqual(getMetadata('api:components:headers', Controller), {
      header1: metadata,
      header2: metadata2
    });
  });

  it('should define the correct metadata (class).', () => {
    const metadataFunc = (controller: any) => metadata;
    @ApiDefineHeader('header1', metadataFunc)
    class Controller {}

    deepStrictEqual(getMetadata('api:components:headers', Controller), {
      header1: metadataFunc,
    });
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiDefineHeader('header1', metadata)
      @ApiDefineHeader('header2', metadata2)
      foo() { }
    }

    deepStrictEqual(getMetadata('api:components:headers', Controller, 'foo'), {
      header1: metadata,
      header2: metadata2
    });
  });

});

describe('ApiDefineSecurityScheme', () => {

  const metadata: IApiSecurityScheme = {
    scheme: 'basic',
    type: 'http',
  };
  const metadata2: IApiSecurityScheme = {
    in: 'header',
    name: 'api_key',
    type: 'apiKey',
  };

  it('should define the correct metadata (class).', () => {
    @ApiDefineSecurityScheme('scheme1', metadata)
    @ApiDefineSecurityScheme('scheme2', metadata2)
    class Controller {}

    deepStrictEqual(getMetadata('api:components:securitySchemes', Controller), {
      scheme1: metadata,
      scheme2: metadata2
    });
  });

  it('should define the correct metadata (class).', () => {
    const metadataFunc = (controller: any) => metadata;
    @ApiDefineSecurityScheme('scheme1', metadataFunc)
    class Controller {}

    deepStrictEqual(getMetadata('api:components:securitySchemes', Controller), {
      scheme1: metadataFunc,
    });
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiDefineSecurityScheme('scheme1', metadata)
      @ApiDefineSecurityScheme('scheme2', metadata2)
      foo() { }
    }

    deepStrictEqual(getMetadata('api:components:securitySchemes', Controller, 'foo'), {
      scheme1: metadata,
      scheme2: metadata2
    });
  });

});

describe('ApiDefineLink', () => {

  const metadata: IApiLink = {};
  const metadata2: IApiLink = {};

  it('should define the correct metadata (class).', () => {
    @ApiDefineLink('link1', metadata)
    @ApiDefineLink('link2', metadata2)
    class Controller {}

    deepStrictEqual(getMetadata('api:components:links', Controller), {
      link1: metadata,
      link2: metadata2
    });
  });

  it('should define the correct metadata (class).', () => {
    const metadataFunc = (controller: any) => metadata;
    @ApiDefineLink('link1', metadataFunc)
    class Controller {}

    deepStrictEqual(getMetadata('api:components:links', Controller), {
      link1: metadataFunc,
    });
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiDefineLink('link1', metadata)
      @ApiDefineLink('link2', metadata2)
      foo() { }
    }

    deepStrictEqual(getMetadata('api:components:links', Controller, 'foo'), {
      link1: metadata,
      link2: metadata2
    });
  });

});

describe('ApiDefineCallback', () => {

  const metadata: IApiCallback = {};
  const metadata2: IApiCallback = {};

  it('should define the correct metadata (class).', () => {
    @ApiDefineCallback('cb1', metadata)
    @ApiDefineCallback('cb2', metadata2)
    class Controller {}

    deepStrictEqual(getMetadata('api:components:callbacks', Controller), {
      cb1: metadata,
      cb2: metadata2
    });
  });

  it('should define the correct metadata (class & dynamic).', () => {
    const metadataFunc = (controller: any) => metadata;
    @ApiDefineCallback('cb1', metadataFunc)
    class Controller {}

    deepStrictEqual(getMetadata('api:components:callbacks', Controller), {
      cb1: metadataFunc,
    });
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiDefineCallback('cb1', metadata)
      @ApiDefineCallback('cb2', metadata2)
      foo() { }
    }

    deepStrictEqual(getMetadata('api:components:callbacks', Controller, 'foo'), {
      cb1: metadata,
      cb2: metadata2
    });
  });

});
