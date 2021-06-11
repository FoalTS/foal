import { Class } from '../class.interface';
import { makeControllerRoutes } from '../routes';
import { ServiceManager } from '../service-manager';
import { IOpenAPI } from './interfaces';
import { OpenApi } from './openapi.service';

export function createOpenApiDocument(controllerClass: Class, serviceManager?: ServiceManager): IOpenAPI {
  const services = serviceManager ?? new ServiceManager();
  Array.from(makeControllerRoutes(controllerClass, services));
  return services.get(OpenApi).getDocument(controllerClass);
}
