// std
import { deepStrictEqual } from 'assert';

// 3p
import * as request from 'supertest';
import { BaseEntity } from 'typeorm';

// FoalTs
import {
  ApiInfo,
  ApiParameter,
  Context,
  createApp,
  createOpenApiDocument,
  Delete,
  dependency,
  Get,
  HttpResponse,
  HttpResponseCreated,
  HttpResponseNotFound,
  IApiSchema,
  IOpenAPI,
  Patch,
  Post,
  ValidateBody
} from '@foal/core';

describe('FoalTS', () => {
  it('should handle controller inheritance properly ("this" reference, OpenAPI, etc).', async () => {
    // From issue: https://github.com/FoalTS/foal/issues/459 "Decorators Inheritance Problem"

    /* Abstract */

    interface CRUDService {
      create(body: any): any;
      findById(id: any): any;
      update(id: any, body: any): any;
      deleteById(id: any): any;
    }

    abstract class BaseController {
      abstract service: CRUDService;
      entity: typeof BaseEntity;
      schema: IApiSchema;

      constructor(entity: typeof BaseEntity, schema: IApiSchema) {
        this.entity = entity;
        this.schema = schema;
      }

      @Post('/')
      @ValidateBody((c: BaseController) => c.schema)
      async create(ctx: Context): Promise<HttpResponse> {
        const result = await this.service.create(ctx.request.body);
        return new HttpResponseCreated(result);
      }

      @Get('/')
      async findAll(): Promise<HttpResponse> {
        const result = await this.entity.find();
        return new HttpResponseCreated(result);
      }

      @Get('/:id')
      @ApiParameter({
        in: 'path',
        name: 'id',
        required: true,
        schema: { type: 'integer' }
      })
      async findById(ctx: Context): Promise<HttpResponse> {
        const result = await this.service.findById(ctx.request.params.id);
        if (result) {
          return new HttpResponseCreated(result);
        }
        return new HttpResponseNotFound();
      }

      @Patch('/:id')
      @ApiParameter({
        in: 'path',
        name: 'id',
        required: true,
        schema: { type: 'integer' }
      })
      @ValidateBody((c: BaseController) => c.schema)
      async update(ctx: Context): Promise<HttpResponse> {
        const result = await this.service.update(ctx.request.params.id, ctx.request.body);
        if (result) {
          return new HttpResponseCreated(result);
        }
        return new HttpResponseNotFound();
      }

      @Delete('/:id')
      @ApiParameter({
        in: 'path',
        name: 'id',
        required: true,
        schema: { type: 'integer' }
      })
      async deleteById(ctx: Context): Promise<HttpResponse> {
        const result = await this.service.deleteById(ctx.request.params.id);
        if (result) {
          return new HttpResponseCreated();
        }
        return new HttpResponseNotFound();
      }
    }

    /* Concrete */

    const someSchema: IApiSchema = {
      properties: {
        name: {
          type: 'string'
        },
      },
      required: [ 'name' ],
      type: 'object',
    };

    class SomeEntity extends BaseEntity {

    }

    class SomeService implements CRUDService  {
      create(body: any) {
        return body;
      }
      findById(id: any) {
        throw new Error('Method not implemented.');
      }
      update(id: any, body: any) {
        throw new Error('Method not implemented.');
      }
      deleteById(id: any) {
        throw new Error('Method not implemented.');
      }
    }

    @ApiInfo({
      title: 'Some API',
      version: '1.0.0'
    })
    class SomeController extends BaseController {
      @dependency
      service: SomeService;

      constructor() {
        super(SomeEntity, someSchema);
      }
    }

    // Test the OpenAPI decorators
    const document = createOpenApiDocument(SomeController);
    const expectedDocument: IOpenAPI = {
      info: {
        title: 'Some API',
        version: '1.0.0'
      },
      openapi: '3.0.0',
      paths: {
        '/': {
          get: {
            responses: {}
          },
          post: {
            requestBody: {
              content: {
                'application/json': {
                  schema: someSchema
                }
              },
              required: true
            },
            responses: {
              400: { description: 'Bad request.' }
            }
          },
        },
        '/{id}': {
          delete: {
            parameters: [
              {
                in: 'path',
                name: 'id',
                required: true,
                schema: { type: 'integer' }
              }
            ],
            responses: {}
          },
          get: {
            parameters: [
              {
                in: 'path',
                name: 'id',
                required: true,
                schema: { type: 'integer' }
              }
            ],
            responses: {}
          },
          patch: {
            parameters: [
              {
                in: 'path',
                name: 'id',
                required: true,
                schema: { type: 'integer' }
              }
            ],
            requestBody: {
              content: {
                'application/json': {
                  schema: someSchema
                }
              },
              required: true
            },
            responses: {
              400: { description: 'Bad request.' }
            }
          },
        }
      }
    };
    deepStrictEqual(document, expectedDocument);

    const app = await createApp(SomeController);

    // Test the hook
    await request(app)
      .post('/')
      .send({})
      .expect(400)
      .expect({
        body: [
          {
            instancePath: '',
            keyword: 'required',
            message: 'must have required property \'name\'',
            params: {
              missingProperty: 'name'
            },
            schemaPath: '#/required',
          }
        ]
      });

    // Test the service
    return request(app)
      .post('/')
      .send({ name: 'string' })
      .expect(201)
      .expect({ name: 'string' });
  });

});
