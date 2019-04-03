// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import { getMetadata } from '../core/routes/utils';
import {
  ApiCallback, ApiDefineCallback, ApiDefineExample, ApiDefineHeader,
  ApiDefineLink, ApiDefineParameter, ApiDefineRequestBody, ApiDefineResponse,
  ApiDefineSchema, ApiDefineSecurityScheme, ApiDefineTag, ApiDeprecated,
  ApiExternalDoc, ApiInfo, ApiOperation, ApiParameter, ApiRequestBody,
  ApiResponse, ApiSecurityRequirement, ApiServer, ApiUseTag
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

    strictEqual(getMetadata('api:info', Controller), metadata);
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

  it('should define the correct metadata (controller).', () => {
    @ApiServer(metadata)
    class Controller { }
    deepStrictEqual(getMetadata('api:servers', Controller), [metadata]);

    @ApiServer(metadata)
    @ApiServer(metadata2)
    class Controller2 { }
    deepStrictEqual(getMetadata('api:servers', Controller2), [metadata, metadata2]);
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiServer(metadata)
      foo() { }
    }
    deepStrictEqual(getMetadata('api:servers', Controller, 'foo'), [metadata]);

    class Controller2 {
      @ApiServer(metadata)
      @ApiServer(metadata2)
      foo() { }
    }
    deepStrictEqual(getMetadata('api:servers', Controller2, 'foo'), [metadata, metadata2]);
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

  it('should define the correct metadata (controller).', () => {
    @ApiSecurityRequirement(metadata)
    class Controller { }
    deepStrictEqual(getMetadata('api:security', Controller), [metadata]);

    @ApiSecurityRequirement(metadata)
    @ApiSecurityRequirement(metadata2)
    class Controller2 { }
    deepStrictEqual(getMetadata('api:security', Controller2), [metadata, metadata2]);
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiSecurityRequirement(metadata)
      foo() { }
    }
    deepStrictEqual(getMetadata('api:security', Controller, 'foo'), [metadata]);

    class Controller2 {
      @ApiSecurityRequirement(metadata)
      @ApiSecurityRequirement(metadata2)
      foo() { }
    }
    deepStrictEqual(getMetadata('api:security', Controller2, 'foo'), [metadata, metadata2]);
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

  it('should define the correct metadata (controller).', () => {
    @ApiDefineTag(metadata)
    class Controller { }
    deepStrictEqual(getMetadata('api:documentTags', Controller), [metadata]);

    @ApiDefineTag(metadata)
    @ApiDefineTag(metadata2)
    class Controller2 { }
    deepStrictEqual(getMetadata('api:documentTags', Controller2), [metadata, metadata2]);
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiDefineTag(metadata)
      foo() { }
    }
    deepStrictEqual(getMetadata('api:documentTags', Controller, 'foo'), [metadata]);

    class Controller2 {
      @ApiDefineTag(metadata)
      @ApiDefineTag(metadata2)
      foo() { }
    }
    deepStrictEqual(getMetadata('api:documentTags', Controller2, 'foo'), [metadata, metadata2]);
  });

});

describe('ApiExternalDoc', () => {

  const metadata: IApiExternalDocumentation = {
    description: 'Find more info here',
    url: 'https://example.com',
  };

  it('should define the correct metadata (controller).', () => {
    @ApiExternalDoc(metadata)
    class Controller { }

    strictEqual(getMetadata('api:externalDocs', Controller), metadata);
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiExternalDoc(metadata)
      foo() { }
    }

    strictEqual(getMetadata('api:externalDocs', Controller, 'foo'), metadata);
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

});

describe('ApiUseTag', () => {

  const metadata: string = 'tag1';
  const metadata2: string = 'tag2';

  it('should define the correct metadata (controller).', () => {
    @ApiUseTag(metadata)
    class Controller { }
    deepStrictEqual(getMetadata('api:operationTags', Controller), [metadata]);

    @ApiUseTag(metadata)
    @ApiUseTag(metadata2)
    class Controller2 { }
    deepStrictEqual(getMetadata('api:operationTags', Controller2), [metadata, metadata2]);
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiUseTag(metadata)
      foo() { }
    }
    deepStrictEqual(getMetadata('api:operationTags', Controller, 'foo'), [metadata]);

    class Controller2 {
      @ApiUseTag(metadata)
      @ApiUseTag(metadata2)
      foo() { }
    }
    deepStrictEqual(getMetadata('api:operationTags', Controller2, 'foo'), [metadata, metadata2]);
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

  it('should define the correct metadata (controller).', () => {
    @ApiParameter(metadata)
    class Controller { }
    deepStrictEqual(getMetadata('api:parameters', Controller), [metadata]);

    @ApiParameter(metadata)
    @ApiParameter(metadata2)
    class Controller2 { }
    deepStrictEqual(getMetadata('api:parameters', Controller2), [metadata, metadata2]);
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiParameter(metadata)
      foo() { }
    }
    deepStrictEqual(getMetadata('api:parameters', Controller, 'foo'), [metadata]);

    class Controller2 {
      @ApiParameter(metadata)
      @ApiParameter(metadata2)
      foo() { }
    }
    deepStrictEqual(getMetadata('api:parameters', Controller2, 'foo'), [metadata, metadata2]);
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

    strictEqual(getMetadata('api:requestBody', Controller, 'foo'), metadata);
  });

});

describe('ApiResponse', () => {

  it('should define the correct metadata (method).', () => {
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

    class Controller {
      @ApiResponse('default', metadata)
      @ApiResponse(404, metadata2)
      foo() { }
    }

    deepStrictEqual(getMetadata('api:responses', Controller, 'foo'), {
      default: metadata,
      404: metadata2
    });
  });

});

describe('ApiCallback', () => {

  it('should define the correct metadata (method).', () => {
    const metadata: IApiCallback = {};
    const metadata2: IApiCallback = {};

    class Controller {
      @ApiCallback('callback1', metadata)
      @ApiCallback('callback2', metadata2)
      foo() { }
    }

    deepStrictEqual(getMetadata('api:callbacks', Controller, 'foo'), {
      callback1: metadata,
      callback2: metadata2
    });
  });

});

describe('ApiDeprecated', () => {

  const metadata: boolean = true;

  it('should define the correct metadata (controller).', () => {
    @ApiDeprecated(metadata)
    class Controller {}

    strictEqual(getMetadata('api:deprecated', Controller), metadata);
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiDeprecated(metadata)
      foo() { }
    }

    strictEqual(getMetadata('api:deprecated', Controller, 'foo'), metadata);
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

  it('should define the correct metadata (controller).', () => {
    @ApiDefineSchema('schema1', metadata)
    @ApiDefineSchema('schema2', metadata2)
    class Controller {}

    deepStrictEqual(getMetadata('api:schemas', Controller), {
      schema1: metadata,
      schema2: metadata2
    });
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiDefineSchema('schema1', metadata)
      @ApiDefineSchema('schema2', metadata2)
      foo() { }
    }

    deepStrictEqual(getMetadata('api:schemas', Controller, 'foo'), {
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

  it('should define the correct metadata (controller).', () => {
    @ApiDefineResponse('response1', metadata)
    @ApiDefineResponse('response2', metadata2)
    class Controller {}

    deepStrictEqual(getMetadata('api:responses', Controller), {
      response1: metadata,
      response2: metadata2
    });
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiDefineResponse('response1', metadata)
      @ApiDefineResponse('response2', metadata2)
      foo() { }
    }

    deepStrictEqual(getMetadata('api:responses', Controller, 'foo'), {
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

  it('should define the correct metadata (controller).', () => {
    @ApiDefineParameter('parameter1', metadata)
    @ApiDefineParameter('parameter2', metadata2)
    class Controller {}

    deepStrictEqual(getMetadata('api:parameters', Controller), {
      parameter1: metadata,
      parameter2: metadata2
    });
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiDefineParameter('parameter1', metadata)
      @ApiDefineParameter('parameter2', metadata2)
      foo() { }
    }

    deepStrictEqual(getMetadata('api:parameters', Controller, 'foo'), {
      parameter1: metadata,
      parameter2: metadata2
    });
  });

});

describe('ApiDefineExample', () => {

  const metadata: IApiExample = {};
  const metadata2: IApiExample = {};

  it('should define the correct metadata (controller).', () => {
    @ApiDefineExample('example1', metadata)
    @ApiDefineExample('example2', metadata2)
    class Controller {}

    deepStrictEqual(getMetadata('api:examples', Controller), {
      example1: metadata,
      example2: metadata2
    });
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiDefineExample('example1', metadata)
      @ApiDefineExample('example2', metadata2)
      foo() { }
    }

    deepStrictEqual(getMetadata('api:examples', Controller, 'foo'), {
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

  it('should define the correct metadata (controller).', () => {
    @ApiDefineRequestBody('requestBody1', metadata)
    @ApiDefineRequestBody('requestBody2', metadata2)
    class Controller {}

    deepStrictEqual(getMetadata('api:requestBodies', Controller), {
      requestBody1: metadata,
      requestBody2: metadata2
    });
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiDefineRequestBody('requestBody1', metadata)
      @ApiDefineRequestBody('requestBody2', metadata2)
      foo() { }
    }

    deepStrictEqual(getMetadata('api:requestBodies', Controller, 'foo'), {
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

  it('should define the correct metadata (controller).', () => {
    @ApiDefineHeader('header1', metadata)
    @ApiDefineHeader('header2', metadata2)
    class Controller {}

    deepStrictEqual(getMetadata('api:headers', Controller), {
      header1: metadata,
      header2: metadata2
    });
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiDefineHeader('header1', metadata)
      @ApiDefineHeader('header2', metadata2)
      foo() { }
    }

    deepStrictEqual(getMetadata('api:headers', Controller, 'foo'), {
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

  it('should define the correct metadata (controller).', () => {
    @ApiDefineSecurityScheme('scheme1', metadata)
    @ApiDefineSecurityScheme('scheme2', metadata2)
    class Controller {}

    deepStrictEqual(getMetadata('api:securitySchemes', Controller), {
      scheme1: metadata,
      scheme2: metadata2
    });
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiDefineSecurityScheme('scheme1', metadata)
      @ApiDefineSecurityScheme('scheme2', metadata2)
      foo() { }
    }

    deepStrictEqual(getMetadata('api:securitySchemes', Controller, 'foo'), {
      scheme1: metadata,
      scheme2: metadata2
    });
  });

});

describe('ApiDefineLink', () => {

  const metadata: IApiLink = {};
  const metadata2: IApiLink = {};

  it('should define the correct metadata (controller).', () => {
    @ApiDefineLink('link1', metadata)
    @ApiDefineLink('link2', metadata2)
    class Controller {}

    deepStrictEqual(getMetadata('api:links', Controller), {
      link1: metadata,
      link2: metadata2
    });
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiDefineLink('link1', metadata)
      @ApiDefineLink('link2', metadata2)
      foo() { }
    }

    deepStrictEqual(getMetadata('api:links', Controller, 'foo'), {
      link1: metadata,
      link2: metadata2
    });
  });

});

describe('ApiDefineCallback', () => {

  const metadata: IApiCallback = {};
  const metadata2: IApiCallback = {};

  it('should define the correct metadata (controller).', () => {
    @ApiDefineCallback('cb1', metadata)
    @ApiDefineCallback('cb2', metadata2)
    class Controller {}

    deepStrictEqual(getMetadata('api:callbacks', Controller), {
      cb1: metadata,
      cb2: metadata2
    });
  });

  it('should define the correct metadata (method).', () => {
    class Controller {
      @ApiDefineCallback('cb1', metadata)
      @ApiDefineCallback('cb2', metadata2)
      foo() { }
    }

    deepStrictEqual(getMetadata('api:callbacks', Controller, 'foo'), {
      cb1: metadata,
      cb2: metadata2
    });
  });

});
