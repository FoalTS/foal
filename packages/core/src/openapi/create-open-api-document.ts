// FoalTS
import { Class, ServiceManager } from '../core';
import { getMethods } from '../core/routes/make-controller-routes';
import { getHttpMethod, getPath } from '../core/routes/utils';
import { IApiComponents, IApiOperation, IApiPaths, IApiTag, IOpenAPI } from './interfaces';
import { getApiCompleteOperation, getApiComponents, getApiInfo, getApiTags } from './metadata-getters';
import { mergeComponents, mergeOperations, mergeTags } from './utils';

function throwErrorIfDuplicatePaths(paths: IApiPaths): void {
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

function getPaths(
  controllerClass: Class, operation: IApiOperation, controllers: ServiceManager
): { paths: IApiPaths, components: IApiComponents, tags: IApiTag[]|undefined } {
  const paths: IApiPaths = {};
  let components: IApiComponents = {};
  let tags: IApiTag[] | undefined;

  // Sub-controller methods.
  const controller = controllers.get(controllerClass);
  if (controller.subControllers) {
    for (const subControllerClass of controller.subControllers) {
      const subControllerOperation = getApiCompleteOperation(subControllerClass, controllers.get(subControllerClass));
      const o = getPaths(subControllerClass, mergeOperations(operation, subControllerOperation), controllers);

      const subControllerComponents = getApiComponents(subControllerClass, controllers.get(subControllerClass));
      components = mergeComponents(components, mergeComponents(subControllerComponents, o.components));

      const subControllerTags = getApiTags(subControllerClass);
      tags = mergeTags(tags, mergeTags(subControllerTags, o.tags));

      const subPaths = o.paths;
      const subControllerPath = getPath(subControllerClass) || '';
      // tslint:disable-next-line:forin
      for (const subPath in subPaths) {
        const subPathItem = subPaths[subPath];
        paths[subControllerPath + subPath] = {
          ...paths[subControllerPath + subPath], // Potentially undefined
          ...subPathItem
        };
      }
    }
  }

  // Controller methods.
  for (const propertyKey of getMethods(controllerClass.prototype)) {
    const httpMethod = getHttpMethod(controllerClass, propertyKey);

    if (!httpMethod) {
      continue;
    }

    components = mergeComponents(
      components,
      getApiComponents(controllerClass, controllers.get(controllerClass), propertyKey)
    );
    tags = mergeTags(tags, getApiTags(controllerClass, propertyKey));

    const path = (getPath(controllerClass, propertyKey) || '')
      .replace(/\:\w*/g, $1 => `{${$1.slice(1)}}`);

    paths[path] = {
      ...paths[path],
      [httpMethod.toLowerCase()]: mergeOperations(
        operation,
        getApiCompleteOperation(controllerClass, controllers.get(controllerClass), propertyKey)
      )
    };
  }

  return { components, paths, tags };
}

export function createOpenApiDocument(controllerClass: Class, controllers = new ServiceManager()): IOpenAPI {
  const info = getApiInfo(controllerClass);
  if (!info) {
    throw new Error('The API root controller should be decorated with @ApiInfo.');
  }

  const controller = controllers.get(controllerClass);
  const document: IOpenAPI = {
    info: typeof info === 'function' ? info(controller) : info,
    openapi: '3.0.0',
    paths: {}
  };

  const operation = getApiCompleteOperation(controllerClass, controller);

  if (operation.servers) {
    document.servers = operation.servers;
  }

  if (operation.security) {
    document.security = operation.security;
  }

  if (operation.externalDocs) {
    document.externalDocs = operation.externalDocs;
  }

  delete operation.servers;
  delete operation.externalDocs;
  delete operation.security;

  const o = getPaths(controllerClass, operation, controllers);

  const paths = o.paths;
  // Use "... of Object.keys" instead of "... in ..." because properties are changed.
  for (const path of Object.keys(paths)) {
    if (!path.startsWith('/')) {
      paths['/' + path] = paths[path];
      delete paths[path];
    }
  }

  throwErrorIfDuplicatePaths(paths);

  document.paths = paths;

  const components = mergeComponents(
    getApiComponents(controllerClass, controllers.get(controllerClass)),
    o.components
  );
  if (Object.keys(components).length > 0) {
    document.components = components;
  }

  const tags = mergeTags(getApiTags(controllerClass), o.tags);
  if (tags) {
    document.tags = tags;
  }

  return document;
}
