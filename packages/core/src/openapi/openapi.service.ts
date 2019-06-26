import { Class, dependency, ServiceManager } from '../core';
import { createOpenApiDocument } from './create-open-api-document';
import { IOpenAPI } from './interfaces';

export class OpenAPI {
  @dependency
  controllers: ServiceManager;

  createDocument(controllerClass: Class): IOpenAPI {
    return createOpenApiDocument(controllerClass, this.controllers);
  }
}
