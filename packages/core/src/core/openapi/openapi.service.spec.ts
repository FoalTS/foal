import { strictEqual, throws } from 'assert';
import { IOpenAPI } from '../../openapi';
import { createService } from '../service-manager';
import { OpenApi } from './openapi.service';

describe('OpenApi', () => {

  let service: OpenApi;

  beforeEach(() => {
    process.env.SETTINGS_OPENAPI_ENABLED = 'true';
    service = createService(OpenApi);
  });

  afterEach(() => delete process.env.SETTINGS_OPENAPI_ENABLED);

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

});
