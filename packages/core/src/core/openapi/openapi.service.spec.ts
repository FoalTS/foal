// std
import { deepStrictEqual, strictEqual, throws } from 'assert';

// FoalTS
import { Config } from '../config';
import { createService } from '../service-manager';
import { IApiComponents, IOpenAPI } from './interfaces';
import { OpenApi } from './openapi.service';

describe('OpenApi', () => {

  let service: OpenApi;

  beforeEach(() => {
    Config.set('settings.openapi.enabled', true);
    service = createService(OpenApi);
  });

  afterEach(() => Config.remove('settings.openapi.enabled'));

  describe('has a "addDocument" method that', () => {

    it('should register the class controller and the OpenAPI document in the service.', () => {
      const document: IOpenAPI = {
        info: {
          title: 'An API',
          version: '1.0.0',
        },
        openapi: '3.0.0',
        paths: {},
      };

      class ApiController {}

      service.addDocument(ApiController, document);
      strictEqual(service.getDocument(ApiController), document);
    });

  });

  describe('has a "getDocument" method that', () => {

    it('should throw an error if no OpenAPI document is found for the given controller class.', () => {
      class ApiController {}

      throws(
        () => service.getDocument(ApiController),
        {
          message: 'No OpenAPI document found associated with the controller ApiController. '
            + 'Are you sure you added the @ApiInfo decorator on the controller?'
        }
      );
    });

  });

  describe('has a "getComponents" method that', () => {

    it('should return the OpenAPI components of a given controller.', () => {
      const components: IApiComponents = {
        callbacks: {
          callback1: { $ref: 'ref1' }
        }
      };
      const document: IOpenAPI = {
        components,
        info: {
          title: 'An API',
          version: '1.0.0',
        },
        openapi: '3.0.0',
        paths: {},
      };

      class ApiController {}
      class UserController {}
      class ProductController {}

      const apiController = new ApiController();
      const userController = new UserController();
      const productController = new ProductController();

      service.addDocument(ApiController, document, [ apiController, userController ]);

      strictEqual(service.getComponents(apiController), components);
      strictEqual(service.getComponents(userController), components);
      deepStrictEqual(service.getComponents(productController), {});
    });

  });

});
