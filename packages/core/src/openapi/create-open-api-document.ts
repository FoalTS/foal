// FoalTS
import { Class, createController, HttpMethod } from '../core';
import { getMethods } from '../core/routes/make-controller-routes';
import { getHttpMethod, getMetadata, getPath, join } from '../core/routes/utils';
import {
  IApiComponents, IApiExternalDocumentation, IApiInfo, IApiOperation, IApiPathItem,
  IApiPaths, IApiSecurityRequirement, IApiServer, IApiTag, IOpenAPI
} from './interfaces';

function getApiInfo(controllerClass: Class): IApiInfo {
  const info = getMetadata('api:document:info', controllerClass);
  if (!info) {
    throw new Error('The API root controller should be decorated with @ApiInfo.');
  }
  return info;
}

function getComponents(controllerClass: Class, propertyKey?: string): IApiComponents {
  return {
    callbacks: getMetadata('api:components:callbacks', controllerClass, propertyKey) || {},
    examples: getMetadata('api:components:examples', controllerClass, propertyKey) || {},
    headers: getMetadata('api:components:headers', controllerClass, propertyKey) || {},
    links: getMetadata('api:components:links', controllerClass, propertyKey) || {},
    parameters: getMetadata('api:components:parameters', controllerClass, propertyKey) || {},
    requestBodies: getMetadata('api:components:requestBodies', controllerClass, propertyKey) || {},
    responses: getMetadata('api:components:responses', controllerClass, propertyKey) || {},
    schemas: getMetadata('api:components:schemas', controllerClass, propertyKey) || {},
    securitySchemes: getMetadata('api:components:securitySchemes', controllerClass, propertyKey) || {},
  };
}

function getTags(controllerClass: Class, propertyKey?: string): IApiTag[] {
  return getMetadata('api:document:tags', controllerClass, propertyKey) || [];
}

function getExternalDocs(controllerClass: Class, propertyKey?: string): IApiExternalDocumentation | undefined {
  return getMetadata('api:documentOrOperation:externalDocs', controllerClass, propertyKey);
}

function getServers(controllerClass: Class, propertyKey?: string): IApiServer[] | undefined {
  return getMetadata('api:documentOrOperation:servers', controllerClass, propertyKey);
}

function getSecurity(controllerClass: Class, propertyKey?: string): IApiSecurityRequirement[] | undefined {
  return getMetadata('api:documentOrOperation:security', controllerClass, propertyKey);
}

function pathsFrom(...paths: IApiPaths[]): IApiPaths {
  return Object.assign({}, ...paths);
}

function convertPathTemplating(path: string): string {
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  return path.replace(/\:\w*/g, $1 => `{${$1.slice(1)}}`);
}

function checkDuplicatePaths(paths: IApiPaths): void {
  const originalPaths: string[] = [];
  const convertedPaths: string[] = [];
  // tslint:disable-next-line:forin
  for (const path in paths) {
    const convertedPath = path.replace(/{.*}/g, () => '#');
    const index = convertedPaths.indexOf(convertedPath);
    if (index !== -1) {
      throw new Error(
        'Templated paths with the same hierarchy but different templated names MUST NOT exist as they are identical.'
        + `\n  Path 1: ${originalPaths[index]}`
        + `\n  Path 2: ${path}`
      );
    }
    originalPaths.push(path);
    convertedPaths.push(convertedPath);
  }
}

function getOperation(controllerClass: Class, propertyKey?: string): IApiOperation {
  const operation: IApiOperation = {
    responses: {}
  };

  const externalDocs = getExternalDocs(controllerClass, propertyKey);
  if (externalDocs) {
    operation.externalDocs = externalDocs;
  }

  const security = getSecurity(controllerClass, propertyKey);
  if (security) {
    operation.security = security;
  }

  const servers = getServers(controllerClass, propertyKey);
  if (servers) {
    operation.servers = servers;
  }

  return operation;
}

function componentsFrom(...componentss: IApiComponents[]): IApiComponents {
  const components: IApiComponents = {};

  for (const sourceComponents of componentss) {
    if (sourceComponents.callbacks) {
      components.callbacks = Object.assign({}, components.callbacks, sourceComponents.callbacks);
    }
    if (sourceComponents.examples) {
      components.examples = Object.assign({}, components.examples, sourceComponents.examples);
    }
    if (sourceComponents.headers) {
      components.headers = Object.assign({}, components.headers, sourceComponents.headers);
    }
    if (sourceComponents.links) {
      components.links = Object.assign({}, components.links, sourceComponents.links);
    }
    if (sourceComponents.parameters) {
      components.parameters = Object.assign({}, components.parameters, sourceComponents.parameters);
    }
    if (sourceComponents.requestBodies) {
      components.requestBodies = Object.assign({}, components.requestBodies, sourceComponents.requestBodies);
    }
    if (sourceComponents.responses) {
      components.responses = Object.assign({}, components.responses, sourceComponents.responses);
    }
    if (sourceComponents.schemas) {
      components.schemas = Object.assign({}, components.schemas, sourceComponents.schemas);
    }
    if (sourceComponents.parameters) {
      components.securitySchemes = Object.assign({}, components.securitySchemes, sourceComponents.securitySchemes);
    }
  }

  return components;
}

function operationFrom(...operations: (IApiOperation|undefined)[]): IApiOperation {
  const operation: IApiOperation = {
    responses: {}
  };

  for (const sourceOperation of operations) {
    if (!sourceOperation) {
      continue;
    }

    if (sourceOperation.externalDocs) {
      operation.externalDocs = sourceOperation.externalDocs;
    }
    if (sourceOperation.security) {
      operation.security = sourceOperation.security;
    }
    if (sourceOperation.servers) {
      operation.servers = sourceOperation.servers;
    }
  }

  return operation;
}

function tagsFrom(tags1: IApiTag[], tags2: IApiTag[], tags3: IApiTag[] = []): IApiTag[] {
  return tags1.concat(tags2).concat(tags3);
}

function getApiComponentsTagsAndPaths(
  controllerClass: Class, root: boolean, pathPrefix: string = '', controllerOperation: IApiOperation = { responses: {}}
): {
  components: IApiComponents, tags: IApiTag[], paths: IApiPaths
} {
  // Controller class
  const result: { components: IApiComponents, tags: IApiTag[], paths: IApiPaths } = {
    components: getComponents(controllerClass),
    paths: {},
    tags: getTags(controllerClass),
  };
  const controllerPathPrefix = join(pathPrefix, getPath(controllerClass));
  if (!root) {
    controllerOperation = operationFrom(controllerOperation, getOperation(controllerClass));
  }

  // Sub-controllers
  const controller = createController(controllerClass);
  if (controller.subControllers) {
    for (const subControllerClass of controller.subControllers) {
      const { components, tags, paths } = getApiComponentsTagsAndPaths(
        subControllerClass,
        false,
        controllerPathPrefix,
        controllerOperation
      );
      result.tags = tagsFrom(result.tags, tags);
      result.components = componentsFrom(result.components, components);
      result.paths = pathsFrom(result.paths, paths);
    }
  }

  // Controller methods
  for (const propertyKey of getMethods(controllerClass.prototype)) {
    const httpMethod = getHttpMethod(controllerClass, propertyKey);

    if (!httpMethod) {
      continue;
    }

    let operation = getOperation(controllerClass, propertyKey);
    const tags = getTags(controllerClass, propertyKey);
    const components = getComponents(controllerClass, propertyKey);

    result.tags = tagsFrom(result.tags, tags);
    result.components = componentsFrom(result.components, components);

    operation = operationFrom(controllerOperation, operation);

    const path = getPath(controllerClass, propertyKey) || '';
    const keyPath = convertPathTemplating(join(controllerPathPrefix, path));
    const pathItem: IApiPathItem = {
      ...result.paths[keyPath],
      [httpMethod.toLowerCase()]: operation
    };

    result.paths[keyPath] = pathItem;
  }

  return result;
}

export function createOpenApiDocument(controllerClass: Class): IOpenAPI {
  const { components, tags, paths } = getApiComponentsTagsAndPaths(controllerClass, true);
  checkDuplicatePaths(paths);
  const document: IOpenAPI = {
    components,
    info: getApiInfo(controllerClass),
    openapi: '3.0.0',
    paths,
    tags,
  };

  const externalDocs = getExternalDocs(controllerClass);
  if (externalDocs) {
    document.externalDocs = externalDocs;
  }

  const servers = getServers(controllerClass);
  if (servers) {
    document.servers = servers;
  }

  const security = getSecurity(controllerClass);
  if (security) {
    document.security = security;
  }

  return document;
}
