// FoalTS
import { Class, createController } from '../core';
import { getMethods } from '../core/routes/make-controller-routes';
import { getHttpMethod, getPath, join } from '../core/routes/utils';
import {
  IApiComponents, IApiOperation,
  IApiPaths, IApiTag, IOpenAPI
} from './interfaces';
import {
  getApiCompleteOperation, getApiComponents, getApiExternalDocs, getApiInfo, getApiSecurity,
  getApiServers, getApiTags
} from './utils';

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

  const externalDocs = getApiExternalDocs(controllerClass, propertyKey);
  if (externalDocs) {
    operation.externalDocs = externalDocs;
  }

  const security = getApiSecurity(controllerClass, propertyKey);
  if (security) {
    operation.security = security;
  }

  const servers = getApiServers(controllerClass, propertyKey);
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

interface PartialDocument {
  paths: IApiPaths;
  tags: IApiTag[];
  components: IApiComponents;
}

function addPrefixToPaths(prefix: string, paths: IApiPaths): IApiPaths {
  const result: IApiPaths = {};

  // tslint:disable-next-line:forin
  for (const path in paths) {
    result[join(prefix, path)] = paths[path];
  }

  return result;
}

function getPartialDocument(controllerClass: Class, root: boolean): PartialDocument {
  // Controller class
  let components = getApiComponents(controllerClass);
  let tags = getApiTags(controllerClass) || [];
  const controllerPath = getPath(controllerClass) || '';
  const controllerOperation = getOperation(controllerClass); // Pb if is root

  // Sub-controllers & Controller methods
  let paths: IApiPaths = {};

  // Sub-controllers
  const controller = createController(controllerClass);
  if (controller.subControllers) {
    for (const subControllerClass of controller.subControllers) {
      const subDocument = getPartialDocument(subControllerClass, false);
      tags = tagsFrom(tags, subDocument.tags);
      components = componentsFrom(components, subDocument.components);
      paths = pathsFrom(paths, addPrefixToPaths(controllerPath, subDocument.paths));
    }
  }

  // Controller methods
  for (const propertyKey of getMethods(controllerClass.prototype)) {
    const httpMethod = getHttpMethod(controllerClass, propertyKey);

    if (!httpMethod) {
      continue;
    }

    const methodTags = getApiTags(controllerClass, propertyKey) || [];
    const methodComponents = getApiComponents(controllerClass, propertyKey);
    tags = tagsFrom(tags, methodTags);
    components = componentsFrom(components, methodComponents);

    let methodOperation = getApiCompleteOperation(controllerClass, propertyKey);
    methodOperation = operationFrom(controllerOperation, methodOperation);

    const path = getPath(controllerClass, propertyKey) || '';
    // Là c'est plus bon pour le début du slash.
    const keyPath = convertPathTemplating(join(controllerPath, path));
    paths[keyPath] = {
      ...paths[keyPath],
      [httpMethod.toLowerCase()]: methodOperation
    };
  }

  return { components, paths, tags };
}

export function createOpenApiDocument(controllerClass: Class): IOpenAPI {
  const info = getApiInfo(controllerClass);
  if (!info) {
    throw new Error('The API root controller should be decorated with @ApiInfo.');
  }

  const document: IOpenAPI = {
    info,
    openapi: '3.0.0',
    paths: {}
  };

  const servers = getApiServers(controllerClass);
  if (servers) {
    document.servers = servers;
  }

  const components = getApiComponents(controllerClass);
  if (Object.keys(components).length > 0) {
    document.components = components;
  }

  const security = getApiSecurity(controllerClass);
  if (security) {
    document.security = security;
  }

  const tags = getApiTags(controllerClass);
  if (tags) {
    document.tags = tags;
  }

  const externalDocs = getApiExternalDocs(controllerClass);
  if (externalDocs) {
    document.externalDocs = externalDocs;
  }

  return document;
}

export function xcreateOpenApiDocument(controllerClass: Class): any {
  const { components, tags, paths } = getPartialDocument(controllerClass, true);
  checkDuplicatePaths(paths);

  const document: IOpenAPI = {
    components,
    info: {} as any,
    openapi: '3.0.0',
    paths,
    tags,
  };

  return document;
}
