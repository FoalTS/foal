// std
import { deepStrictEqual } from 'assert';
import { readFileSync } from 'fs';
import { join } from 'path';

// 3p
import { parse } from 'yamljs';

// FoalTS
import {
  ApiDefineSchema, ApiDefineSecurityScheme, ApiDefineTag, ApiDeprecated, ApiExternalDoc, ApiInfo,
  ApiOperation, ApiOperationDescription, ApiOperationId, ApiOperationSummary, ApiParameter, ApiRequestBody,
  ApiResponse, ApiSecurityRequirement, ApiServer, ApiUseTag, controller, createOpenApiDocument, Delete, Get, Post, Put
} from '@foal/core';

it('OpenAPI', async () => {

  @ApiInfo({
    contact: {
      email: 'apiteam@swagger.io'
    },
    description: 'This is a sample server Petstore server.  You can find out more about     Swagger'
      + '\nat [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).'
      + '      For'
      + '\nthis sample, you can use the api key `special-key` to test the authorization     filters.',
    license: {
      name: 'Apache 2.0',
      url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
    },
    termsOfService: 'http://swagger.io/terms/',
    title: 'Swagger Petstore',
    version: '1.0.0'
  })
  @ApiExternalDoc({
    description: 'Find out more about Swagger',
    url: 'http://swagger.io'
  })
  @ApiServer({
    url: 'https://petstore.swagger.io/v2'
  })
  @ApiServer({
    url: 'http://petstore.swagger.io/v2'
  })
  @ApiDefineTag({
    description: 'Everything about your Pets',
    externalDocs: {
      description: 'Find out more',
      url: 'http://swagger.io'
    },
    name: 'pet',
  })
  @ApiDefineTag({
    description: 'Access to Petstore orders',
    name: 'store',
  })
  @ApiDefineTag({
    description: 'Operations about user',
    externalDocs: {
      description: 'Find out more about our store',
      url: 'http://swagger.io'
    },
    name: 'user',
  })
  @ApiDefineSchema('ApiResponse', {
    properties: {
      code: {
        format: 'int32',
        type: 'integer',
      },
      message: { type: 'string' },
      type: { type: 'string' }
    },
    type: 'object',
  })
  @ApiDefineSecurityScheme('petstore_auth', {
    flows: {
      implicit: {
        authorizationUrl: 'http://petstore.swagger.io/oauth/dialog',
        scopes: {
          'read:pets': 'read your pets',
          'write:pets': 'modify pets in your account',
        }
      }
    },
    type: 'oauth2',
  })
  @ApiDefineSecurityScheme('api_key', {
    in: 'header',
    name: 'api_key',
    type: 'apiKey',
  })
  class ApiController {
    subControllers = [
      controller('/pet', PetController),
      controller('/store', StoreController),
      controller('/user', UserController),
    ];
  }

  @ApiUseTag('pet')
  @ApiDefineSchema('Category', {
    properties: {
      id: {
        format: 'int64',
        type: 'integer',
      },
      name: { type: 'string' }
    },
    type: 'object',
    xml: { name: 'Category' }
  })
  @ApiDefineSchema('Tag', {
    properties: {
      id: {
        format: 'int64',
        type: 'integer',
      },
      name: { type: 'string' }
    },
    type: 'object',
    xml: { name: 'Tag' }
  })
  @ApiDefineSchema('Pet', {
    properties: {
      category: { $ref: '#/components/schemas/Category' },
      id: {
        format: 'int64',
        type: 'integer',
      },
      name: {
        example: 'doggie',
        type: 'string'
      },
      photoUrls: {
        items: { type: 'string' },
        type: 'array',
        xml: {
          name: 'photoUrl',
          wrapped: true
        }
      },
      status: {
        description: 'pet status in the store',
        enum: [ 'available', 'pending', 'sold' ],
        type: 'string',
      },
      tags: {
        items: { $ref: '#/components/schemas/Tag' },
        type: 'array',
        xml: {
          name: 'tag',
          wrapped: true
        }
      }
    },
    required: [ 'name', 'photoUrls' ],
    type: 'object',
    xml: { name: 'Pet' }
  })
  class PetController {
    @Put()
    @ApiOperationId('updatePet')
    @ApiOperationSummary('Update an existing pet')
    @ApiRequestBody({
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Pet' }
        },
        'application/xml': {
          schema: { $ref: '#/components/schemas/Pet' }
        },
      },
      description: 'Pet object that needs to be added to the store',
      required: true
    })
    @ApiResponse(400, { description: 'Invalid ID supplied', content: {} })
    @ApiResponse(404, { description: 'Pet not found', content: {} })
    @ApiResponse(405, { description: 'Validation exception', content: {} })
    @ApiSecurityRequirement({
      petstore_auth: ['write:pets', 'read:pets']
    })
    updatePet() { }

    @Post()
    @ApiOperationId('addPet')
    @ApiOperationSummary('Add a new pet to the store')
    @ApiRequestBody({
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Pet' }
        },
        'application/xml': {
          schema: { $ref: '#/components/schemas/Pet' }
        },
      },
      description: 'Pet object that needs to be added to the store',
      required: true,
    })
    @ApiResponse(405, { description: 'Invalid input', content: {} })
    @ApiSecurityRequirement({
      petstore_auth: ['write:pets', 'read:pets']
    })
    addPet() { }

    @Get('/findByStatus')
    @ApiOperationId('findPetsByStatus')
    @ApiOperationSummary('Finds Pets by status')
    @ApiOperationDescription('Multiple status values can be provided with comma separated strings')
    @ApiParameter({
      description: 'Status values that need to be considered for filter',
      explode: true,
      in: 'query',
      name: 'status',
      required: true,
      schema: {
        items: {
          default: 'available',
          enum: ['available', 'pending', 'sold'],
          type: 'string'
        },
        type: 'array',
      },
      style: 'form'
    })
    @ApiResponse(200, {
      content: {
        'application/json': {
          schema: {
            items: { $ref: '#/components/schemas/Pet' },
            type: 'array',
          }
        },
        'application/xml': {
          schema: {
            items: { $ref: '#/components/schemas/Pet' },
            type: 'array',
          }
        },
      },
      description: 'successful operation',
    })
    @ApiResponse(400, { description: 'Invalid status value', content: {} })
    @ApiSecurityRequirement({
      petstore_auth: ['write:pets', 'read:pets']
    })
    findPetsByStatus() { }

    @Get('/findByTags')
    @ApiOperationId('findPetsByTags')
    @ApiOperationDescription('Muliple tags can be provided with comma separated strings. Use         tag1,'
    + '\ntag2, tag3 for testing.')
    @ApiOperationSummary('Finds Pets by tags')
    @ApiParameter({
      description: 'Tags to filter by',
      explode: true,
      in: 'query',
      name: 'tags',
      required: true,
      schema: {
        items: { type: 'string' },
        type: 'array',
      },
      style: 'form',
    })
    @ApiResponse(200, {
      content: {
        'application/json': {
          schema: {
            items: { $ref: '#/components/schemas/Pet' },
            type: 'array',
          }
        },
        'application/xml': {
          schema: {
            items: { $ref: '#/components/schemas/Pet' },
            type: 'array',
          }
        },
      },
      description: 'successful operation',
    })
    @ApiResponse(400, { description: 'Invalid tag value', content: {} })
    @ApiDeprecated()
    @ApiSecurityRequirement({
      petstore_auth: ['write:pets', 'read:pets']
    })
    findPetsByTags() { }

    @Get('/:petId')
    @ApiOperationId('getPetById')
    @ApiOperationSummary('Find pet by ID')
    @ApiOperationDescription('Returns a single pet')
    @ApiParameter({
      description: 'ID of pet to return',
      in: 'path',
      name: 'petId',
      required: true,
      schema: {
        format: 'int64',
        type: 'integer',
      }
    })
    @ApiResponse(200, {
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Pet' }
        },
        'application/xml': {
          schema: { $ref: '#/components/schemas/Pet' }
        },
      },
      description: 'successful operation'
    })
    @ApiResponse(400, { description: 'Invalid ID supplied', content: {} })
    @ApiResponse(404, { description: 'Pet not found', content: {} })
    @ApiSecurityRequirement({ api_key: [] })
    getPetById() { }

    @Post('/:petId')
    @ApiOperation({
      operationId: 'updatePetWithForm',
      responses: {},
      summary: 'Updates a pet in the store with form data'
    })
    @ApiParameter({
      description: 'ID of pet that needs to be updated',
      in: 'path',
      name: 'petId',
      required: true,
      schema: {
        format: 'int64',
        type: 'integer',
      }
    })
    @ApiRequestBody({
      content: {
        'application/x-www-form-urlencoded': {
          schema: {
            properties: {
              name: { type: 'string', description: 'Updated name of the pet' },
              status: { type: 'string', description: 'Updated status of the pet' },
            }
          }
        }
      }
    })
    @ApiResponse(405, { description: 'Invalid input', content: {} })
    @ApiSecurityRequirement({
      petstore_auth: ['write:pets', 'read:pets']
    })
    updatePetWithForm() { }

    @Delete('/:petId')
    @ApiOperation({
      operationId: 'deletePet',
      responses: {},
      summary: 'Deletes a pet'
    })
    @ApiParameter({
      in: 'header',
      name: 'api_key',
      schema: { type: 'string' }
    })
    @ApiParameter({
      description: 'Pet id to delete',
      in: 'path',
      name: 'petId',
      required: true,
      schema: {
        format: 'int64',
        type: 'integer',
      }
    })
    @ApiResponse(400, { description: 'Invalid ID supplied', content: {} })
    @ApiResponse(404, { description: 'Pet not found', content: {} })
    @ApiSecurityRequirement({
      petstore_auth: ['write:pets', 'read:pets']
    })
    deletePet() { }

    @Post('/:petId/uploadImage')
    @ApiOperation({
      operationId: 'uploadFile',
      responses: {},
      summary: 'uploads an image'
    })
    @ApiParameter({
      description: 'ID of pet to update',
      in: 'path',
      name: 'petId',
      required: true,
      schema: {
        format: 'int64',
        type: 'integer',
      }
    })
    @ApiRequestBody({
      content: {
        'multipart/form-data': {
          schema: {
            properties: {
              additionalMetadata: {
                description: 'Additional data to pass to server',
                type: 'string',
              },
              file: {
                description: 'file to upload',
                format: 'binary',
                type: 'string',
              }
            }
          }
        }
      }
    })
    @ApiResponse(200, {
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ApiResponse' }
        }
      },
      description: 'successful operation',
    })
    @ApiSecurityRequirement({
      petstore_auth: ['write:pets', 'read:pets']
    })
    uploadFile() { }
  }

  @ApiUseTag('store')
  @ApiDefineSchema('Order', {
    properties: {
      complete: {
        default: false,
        type: 'boolean',
      },
      id: {
        format: 'int64',
        type: 'integer',
      },
      petId: {
        format: 'int64',
        type: 'integer',
      },
      quantity: {
        format: 'int32',
        type: 'integer',
      },
      shipDate: {
        format: 'date-time',
        type: 'string',
      },
      status: {
        description: 'Order Status',
        enum: [ 'placed', 'approved', 'delivered' ],
        type: 'string',
      }
    },
    type: 'object',
    xml: { name: 'Order' }
  })
  class StoreController {
    @Get('/inventory')
    @ApiOperation({
      description: 'Returns a map of status codes to quantities',
      operationId: 'getInventory',
      responses: {},
      summary: 'Returns pet inventories by status'
    })
    @ApiResponse(200, {
      content: {
        'application/json': {
          schema: {
            additionalProperties: {
              format: 'int32',
              type: 'integer',
            },
            type: 'object',
          }
        }
      },
      description: 'successful operation'
    })
    @ApiSecurityRequirement({
      api_key: []
    })
    getInventory() { }

    @Post('/order')
    @ApiOperation({
      operationId: 'placeOrder',
      responses: {},
      summary: 'Place an order for a pet'
    })
    @ApiRequestBody({
      content: {
        '*/*': {
          schema: { $ref: '#/components/schemas/Order' }
        }
      },
      description: 'order placed for purchasing the pet',
      required: true
    })
    @ApiResponse(200, {
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Order' }
        },
        'application/xml': {
          schema: { $ref: '#/components/schemas/Order' }
        },
      },
      description: 'successful operation'
    })
    @ApiResponse(400, { description: 'Invalid Order', content: {} })
    placeOrder() { }

    @Get('/order/:orderId')
    @ApiOperation({
      description: 'For valid response try integer IDs with value >= 1 and <= 10.         Other'
        + '\nvalues will generated exceptions',
      operationId: 'getOrderById',
      responses: {},
      summary: 'Find purchase order by ID'
    })
    @ApiParameter({
      description: 'ID of pet that needs to be fetched',
      in: 'path',
      name: 'orderId',
      required: true,
      schema: {
        format: 'int64',
        maximum: 10.0,
        minimum: 1.0,
        type: 'integer',
      }
    })
    @ApiResponse(200, {
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Order' }
        },
        'application/xml': {
          schema: { $ref: '#/components/schemas/Order' }
        },
      },
      description: 'successful operation'
    })
    @ApiResponse(400, { description: 'Invalid ID supplied', content: {} })
    @ApiResponse(404, { description: 'Order not found', content: {} })
    getOrderById() { }

    @Delete('/order/:orderId')
    @ApiOperation({
      description: 'For valid response try integer IDs with positive integer value.         Negative'
        + '\nor non-integer values will generate API errors',
      operationId: 'deleteOrder',
      responses: {},
      summary: 'Delete purchase order by ID'
    })
    @ApiParameter({
      description: 'ID of the order that needs to be deleted',
      in: 'path',
      name: 'orderId',
      required: true,
      schema: {
        format: 'int64',
        minimum: 1.0,
        type: 'integer',
      }
    })
    @ApiResponse(400, { description: 'Invalid ID supplied', content: {} })
    @ApiResponse(404, { description: 'Order not found', content: {} })
    deleteOrder() { }

  }

  @ApiUseTag('user')
  @ApiDefineSchema('User', {
    properties: {
      email: { type: 'string' },
      firstName: { type: 'string' },
      id: {
        format: 'int64',
        type: 'integer'
      },
      lastName: { type: 'string' },
      password: { type: 'string' },
      phone: { type: 'string' },
      userStatus: {
        description: 'User Status',
        format: 'int32',
        type: 'integer',
      },
      username: { type: 'string' },
    },
    type: 'object',
    xml: { name: 'User' }
  })
  class UserController {
    @Post('')
    @ApiOperation({
      description: 'This can only be done by the logged in user.',
      operationId: 'createUser',
      responses: {},
      summary: 'Create user'
    })
    @ApiRequestBody({
      content: {
        '*/*': {
          schema: { $ref: '#/components/schemas/User' }
        }
      },
      description: 'Created user object',
      required: true
    })
    @ApiResponse('default', { description: 'successful operation', content: {} })
    createUser() {}

    @Post('/createWithArray')
    @ApiOperation({
      operationId: 'createUsersWithArrayInput',
      responses: {},
      summary: 'Creates list of users with given input array'
    })
    @ApiRequestBody({
      content: {
        '*/*': {
          schema: {
            items: { $ref: '#/components/schemas/User' },
            type: 'array',
          }
        }
      },
      description: 'List of user object',
      required: true
    })
    @ApiResponse('default', { description: 'successful operation', content: {} })
    createUsersWithArrayInput() {}

    @Post('/createWithList')
    @ApiOperation({
      operationId: 'createUsersWithListInput',
      responses: {},
      summary: 'Creates list of users with given input array'
    })
    @ApiRequestBody({
      content: {
        '*/*': {
          schema: {
            items: { $ref: '#/components/schemas/User' },
            type: 'array'
          }
        }
      },
      description: 'List of user object',
      required: true
    })
    @ApiResponse('default', { description: 'successful operation', content: {} })
    createUsersWithListInput() {}

    @Get('/login')
    @ApiOperation({
      operationId: 'loginUser',
      responses: {},
      summary: 'Logs user into the system'
    })
    @ApiParameter({
      description: 'The user name for login',
      in: 'query',
      name: 'username',
      required: true,
      schema: { type: 'string' }
    })
    @ApiParameter({
      description: 'The password for login in clear text',
      in: 'query',
      name: 'password',
      required: true,
      schema: { type: 'string' }
    })
    @ApiResponse(200, {
      content: {
        'application/json': {
          schema: { type: 'string' }
        },
        'application/xml': {
          schema: { type: 'string' }
        },
      },
      description: 'successful operation',
      headers: {
        'X-Expires-After': {
          description: 'date in UTC when token expires',
          schema: {
            format: 'date-time',
            type: 'string',
          }
        },
        'X-Rate-Limit': {
          description: 'calls per hour allowed by the user',
          schema: {
            format: 'int32',
            type: 'integer',
          }
        },
      }
    })
    @ApiResponse(400, { description: 'Invalid username/password supplied', content: {} })
    loginUser() {}

    @Get('/logout')
    @ApiOperation({
      operationId: 'logoutUser',
      responses: {},
      summary: 'Logs out current logged in user session',
    })
    @ApiResponse('default', { description: 'successful operation', content: {} })
    logoutUser() {}

    @Get('/:username')
    @ApiUseTag('store')
    @ApiOperation({
      operationId: 'getUserByName',
      responses: {},
      summary: 'Get user by user name'
    })
    @ApiParameter({
      description: 'The name that needs to be fetched. Use user1 for testing. ',
      in: 'path',
      name: 'username',
      required: true,
      schema: { type: 'string' }
    })
    @ApiResponse(200, {
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/User' }
        },
        'application/xml': {
          schema: { $ref: '#/components/schemas/User' }
        },
      },
      description: 'successful operation'
    })
    @ApiResponse(400, { description: 'Invalid username supplied', content: {} })
    @ApiResponse(404, { description: 'User not found', content: {} })
    getUserByName() {}

    @Put('/:username')
    @ApiOperation({
      description: 'This can only be done by the logged in user.',
      operationId: 'updateUser',
      responses: {},
      summary: 'Updated user'
    })
    @ApiParameter({
      description: 'name that need to be updated',
      in: 'path',
      name: 'username',
      required: true,
      schema: { type: 'string' }
    })
    @ApiRequestBody({
      content: {
        '*/*': {
          schema: { $ref: '#/components/schemas/User' }
        }
      },
      description: 'Updated user object',
      required: true
    })
    @ApiResponse(400, { description: 'Invalid user supplied', content: {} })
    @ApiResponse(404, { description: 'User not found', content: {} })
    updateUser() {}

    @Delete('/:username')
    @ApiOperation({
      description: 'This can only be done by the logged in user.',
      operationId: 'deleteUser',
      responses: {},
      summary: 'Delete user'
    })
    @ApiParameter({
      description: 'The name that needs to be deleted',
      in: 'path',
      name: 'username',
      required: true,
      schema: { type: 'string' }
    })
    @ApiResponse(400, { description: 'Invalid username supplied', content: {} })
    @ApiResponse(404, { description: 'User not found', content: {} })
    deleteUser() {}

  }

  const yamlDocument = readFileSync(join(process.cwd(), './assets/openapi.yml'), 'utf8');
  const expectedDocument = parse(yamlDocument);

  const actualDocument = createOpenApiDocument(ApiController);

  deepStrictEqual(actualDocument, expectedDocument);

});
