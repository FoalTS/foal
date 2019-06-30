import { Class, dependency, ServiceManager } from '../core';
import { createOpenApiDocument } from './create-open-api-document';
import { IOpenAPI } from './interfaces';

/**
 * Service to create OpenAPI documents.
 *
 * @export
 * @class OpenAPI
 */
export class OpenAPI {
  @dependency
  controllers: ServiceManager;

  /**
   * Create an OpenAPI document from a controller class.
   *
   * @param {Class} controllerClass - The controller class.
   * @returns {IOpenAPI} The generated OpenAPI document.
   * @memberof OpenAPI
   */
  createDocument(controllerClass: Class): IOpenAPI {
    return createOpenApiDocument(controllerClass, this.controllers);
  }
}
