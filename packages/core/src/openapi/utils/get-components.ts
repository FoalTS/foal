import { Class } from '../../core';

import { IApiComponents } from '../interfaces';

import { getMetadata } from '../../core/routes/utils';

export function getComponents(controllerClass: Class, propertyKey?: string): IApiComponents {
  const components: IApiComponents = {};

  const callbacks = getMetadata('api:components:callbacks', controllerClass, propertyKey);
  if (callbacks) {
    components.callbacks = callbacks;
  }

  const examples = getMetadata('api:components:examples', controllerClass, propertyKey);
  if (examples) {
    components.examples = examples;
  }

  const headers = getMetadata('api:components:headers', controllerClass, propertyKey);
  if (headers) {
    components.headers = headers;
  }

  const links = getMetadata('api:components:links', controllerClass, propertyKey);
  if (links) {
    components.links = links;
  }

  const parameters = getMetadata('api:components:parameters', controllerClass, propertyKey);
  if (parameters) {
    components.parameters = parameters;
  }

  const requestBodies = getMetadata('api:components:requestBodies', controllerClass, propertyKey);
  if (requestBodies) {
    components.requestBodies = requestBodies;
  }

  const responses = getMetadata('api:components:responses', controllerClass, propertyKey);
  if (responses) {
    components.responses = responses;
  }

  const schemas = getMetadata('api:components:schemas', controllerClass, propertyKey);
  if (schemas) {
    components.schemas = schemas;
  }

  const securitySchemes = getMetadata('api:components:securitySchemes', controllerClass, propertyKey);
  if (securitySchemes) {
    components.securitySchemes = securitySchemes;
  }

  return components;
}
