import { IApiComponents } from '../interfaces';

export function mergeComponents(components1: IApiComponents, components2: IApiComponents): IApiComponents {
  const components: IApiComponents = {};

  if (components1.schemas || components2.schemas) {
    components.schemas = Object.assign({}, components1.schemas, components2.schemas);
  }

  if (components1.responses || components2.responses) {
    components.responses = Object.assign({}, components1.responses, components2.responses);
  }

  if (components1.parameters || components2.parameters) {
    components.parameters = Object.assign({}, components1.parameters, components2.parameters);
  }

  if (components1.examples || components2.examples) {
    components.examples = Object.assign({}, components1.examples, components2.examples);
  }

  if (components1.requestBodies || components2.requestBodies) {
    components.requestBodies = Object.assign({}, components1.requestBodies, components2.requestBodies);
  }

  if (components1.headers || components2.headers) {
    components.headers = Object.assign({}, components1.headers, components2.headers);
  }

  if (components1.securitySchemes || components2.securitySchemes) {
    components.securitySchemes = Object.assign({}, components1.securitySchemes, components2.securitySchemes);
  }

  if (components1.links || components2.links) {
    components.links = Object.assign({}, components1.links, components2.links);
  }

  if (components1.callbacks || components2.callbacks) {
    components.callbacks = Object.assign({}, components1.callbacks, components2.callbacks);
  }

  return components;
}
