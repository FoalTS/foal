// FoalTS
import { Class, createController } from '../core';
import { getMethods } from '../core/routes/make-controller-routes';
import { getMetadata } from '../core/routes/utils';
import { IApiComponents, IApiInfo, IOpenAPI } from './interfaces';

function getApiInfo(controllerClass: Class): IApiInfo {
  const info = getMetadata('api:document:info', controllerClass);
  if (!info) {
    throw new Error('The API root controller should be decorated with @ApiInfo.');
  }
  return info;
}

function getApiComponents(controllerClass: Class): IApiComponents {
  // Controller class
  const schemas = getMetadata('api:components:schemas', controllerClass) || {};
  const responses = getMetadata('api:components:responses', controllerClass) || {};
  const parameters = getMetadata('api:components:parameters', controllerClass) || {};
  const examples = getMetadata('api:components:examples', controllerClass) || {};
  const requestBodies = getMetadata('api:components:requestBodies', controllerClass) || {};
  const headers = getMetadata('api:components:headers', controllerClass) || {};
  const securitySchemes = getMetadata('api:components:securitySchemes', controllerClass) || {};
  const links = getMetadata('api:components:links', controllerClass) || {};
  const callbacks = getMetadata('api:components:callbacks', controllerClass) || {};

  // Sub-controllers
  const controller = createController(controllerClass);
  if (controller.subControllers) {
    for (const subControllerClass of controller.subControllers) {
      Object.assign(schemas, getApiComponents(subControllerClass).schemas);
      Object.assign(responses, getApiComponents(subControllerClass).responses);
      Object.assign(parameters, getApiComponents(subControllerClass).parameters);
      Object.assign(examples, getApiComponents(subControllerClass).examples);
      Object.assign(requestBodies, getApiComponents(subControllerClass).requestBodies);
      Object.assign(headers, getApiComponents(subControllerClass).headers);
      Object.assign(securitySchemes, getApiComponents(subControllerClass).securitySchemes);
      Object.assign(links, getApiComponents(subControllerClass).links);
      Object.assign(callbacks, getApiComponents(subControllerClass).callbacks);
    }
  }

  // Controller methods
  for (const method of getMethods(controllerClass.prototype)) {
    Object.assign(schemas, getMetadata('api:components:schemas', controllerClass, method));
    Object.assign(responses, getMetadata('api:components:responses', controllerClass, method));
    Object.assign(parameters, getMetadata('api:components:parameters', controllerClass, method));
    Object.assign(examples, getMetadata('api:components:examples', controllerClass, method));
    Object.assign(requestBodies, getMetadata('api:components:requestBodies', controllerClass, method));
    Object.assign(headers, getMetadata('api:components:headers', controllerClass, method));
    Object.assign(securitySchemes, getMetadata('api:components:securitySchemes', controllerClass, method));
    Object.assign(links, getMetadata('api:components:links', controllerClass, method));
    Object.assign(callbacks, getMetadata('api:components:callbacks', controllerClass, method));
  }

  return {
    callbacks,
    examples,
    headers,
    links,
    parameters,
    requestBodies,
    responses,
    schemas,
    securitySchemes,
  };
}

export function createOpenApiDocument(controllerClass: Class): IOpenAPI {
  const document = {
    components: getApiComponents(controllerClass),
    info: getApiInfo(controllerClass),
    openapi: '3.0.0',
    paths: {},
  };

  return document;
}
