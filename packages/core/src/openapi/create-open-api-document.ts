// FoalTS
import { Class, createController } from '../core';
import { getMethods } from '../core/routes/make-controller-routes';
import { getMetadata } from '../core/routes/utils';
import { IApiComponents, IApiInfo, IApiTag, IOpenAPI } from './interfaces';

function getApiInfo(controllerClass: Class): IApiInfo {
  const info = getMetadata('api:document:info', controllerClass);
  if (!info) {
    throw new Error('The API root controller should be decorated with @ApiInfo.');
  }
  return info;
}

function getApiComponentsAndTags(controllerClass: Class): { components: IApiComponents, tags: IApiTag[] } {
  // Controller class
  const components: IApiComponents = {
    callbacks: getMetadata('api:components:callbacks', controllerClass) || {},
    examples: getMetadata('api:components:examples', controllerClass) || {},
    headers: getMetadata('api:components:headers', controllerClass) || {},
    links: getMetadata('api:components:links', controllerClass) || {},
    parameters: getMetadata('api:components:parameters', controllerClass) || {},
    requestBodies: getMetadata('api:components:requestBodies', controllerClass) || {},
    responses: getMetadata('api:components:responses', controllerClass) || {},
    schemas: getMetadata('api:components:schemas', controllerClass) || {},
    securitySchemes: getMetadata('api:components:securitySchemes', controllerClass) || {},
  };
  let tags: IApiTag[] = getMetadata('api:document:tags', controllerClass) || [];

  // Sub-controllers
  const controller = createController(controllerClass);
  if (controller.subControllers) {
    for (const subControllerClass of controller.subControllers) {
      const componentsAndTags = getApiComponentsAndTags(subControllerClass);
      tags = tags.concat(componentsAndTags.tags);
      // tslint:disable-next-line:forin
      for (const property in components) {
        Object.assign(components[property], componentsAndTags.components[property]);
      }
    }
  }

  // Controller methods
  for (const method of getMethods(controllerClass.prototype)) {
    tags = tags.concat(getMetadata('api:document:tags', controllerClass, method) || []);
    // tslint:disable-next-line:forin
    for (const property in components) {
      Object.assign(components[property], getMetadata(`api:components:${property}`, controllerClass, method));
    }
  }

  return { components, tags };
}

export function createOpenApiDocument(controllerClass: Class): IOpenAPI {
  const { components, tags } = getApiComponentsAndTags(controllerClass);
  const document = {
    components,
    info: getApiInfo(controllerClass),
    openapi: '3.0.0',
    paths: {},
    tags,
  };

  return document;
}
