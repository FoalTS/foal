import { Class } from '../../class.interface';

import { IApiComponents } from '../interfaces';

import { getMetadata } from '../../routes/utils';
import { Dynamic } from '../utils';

export function getApiComponents<T>(controllerClass: Class<T>, controller: T, propertyKey?: string): IApiComponents {
  const components: IApiComponents = {};

  const callbacks = getMetadata(
    'api:components:callbacks', controllerClass, propertyKey
  ) as Dynamic<IApiComponents['callbacks']>;
  if (callbacks) {
    components.callbacks = {};
    for (const key in callbacks) {
      const callback = callbacks[key];
      components.callbacks[key] = typeof callback === 'function' ? callback(controller) : callback;
    }
  }

  const examples = getMetadata(
    'api:components:examples', controllerClass, propertyKey
  ) as Dynamic<IApiComponents['examples']>;
  if (examples) {
    components.examples = {};
    for (const key in examples) {
      const example = examples[key];
      components.examples[key] = typeof example === 'function' ? example(controller) : example;
    }
  }

  const headers = getMetadata(
    'api:components:headers', controllerClass, propertyKey
  ) as Dynamic<IApiComponents['headers']>;
  if (headers) {
    components.headers = {};
    for (const key in headers) {
      const header = headers[key];
      components.headers[key] = typeof header === 'function' ? header(controller) : header;
    }
  }

  const links = getMetadata(
    'api:components:links', controllerClass, propertyKey
  ) as Dynamic<IApiComponents['links']>;
  if (links) {
    components.links = {};
    for (const key in links) {
      const link = links[key];
      components.links[key] = typeof link === 'function' ? link(controller) : link;
    }
  }

  const parameters = getMetadata(
    'api:components:parameters', controllerClass, propertyKey
  ) as Dynamic<IApiComponents['parameters']>;
  if (parameters) {
    components.parameters = {};
    for (const key in parameters) {
      const parameter = parameters[key];
      components.parameters[key] = typeof parameter === 'function' ? parameter(controller) : parameter;
    }
  }

  const requestBodies = getMetadata(
    'api:components:requestBodies', controllerClass, propertyKey
  ) as Dynamic<IApiComponents['requestBodies']>;
  if (requestBodies) {
    components.requestBodies = {};
    for (const key in requestBodies) {
      const requestBody = requestBodies[key];
      components.requestBodies[key] = typeof requestBody === 'function' ? requestBody(controller) : requestBody;
    }
  }

  const responses = getMetadata(
    'api:components:responses', controllerClass, propertyKey
  ) as Dynamic<IApiComponents['responses']>;
  if (responses) {
    components.responses = {};
    for (const key in responses) {
      const response = responses[key];
      components.responses[key] = typeof response === 'function' ? response(controller) : response;
    }
  }

  const schemas = getMetadata(
    'api:components:schemas', controllerClass, propertyKey
  ) as Dynamic<IApiComponents['schemas']>;
  if (schemas) {
    components.schemas = {};
    for (const key in schemas) {
      const schema = schemas[key];
      components.schemas[key] = typeof schema === 'function' ? schema(controller) : schema;
    }
  }

  const securitySchemes = getMetadata(
    'api:components:securitySchemes', controllerClass, propertyKey
  ) as Dynamic<IApiComponents['securitySchemes']>;
  if (securitySchemes) {
    components.securitySchemes = {};
    for (const key in securitySchemes) {
      const scheme = securitySchemes[key];
      components.securitySchemes[key] = typeof scheme === 'function' ? scheme(controller) : scheme;
    }
  }

  return components;
}
