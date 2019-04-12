// FoalTS
import { Class, createController } from '../core';
import { getMethods } from '../core/routes/make-controller-routes';
import { getHttpMethod, getMetadata, getPath, join } from '../core/routes/utils';
import { IApiComponents, IApiInfo, IApiPaths, IApiTag, IOpenAPI } from './interfaces';

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

function mergeComponents(target: IApiComponents, source: IApiComponents): void {
  Object.assign(target.callbacks, source.callbacks);
  Object.assign(target.examples, source.examples);
  Object.assign(target.headers, source.headers);
  Object.assign(target.links, source.links);
  Object.assign(target.parameters, source.parameters);
  Object.assign(target.requestBodies, source.requestBodies);
  Object.assign(target.responses, source.responses);
  Object.assign(target.schemas, source.schemas);
  Object.assign(target.securitySchemes, source.securitySchemes);
}

function mergeTags(target: IApiTag[], source: IApiTag[]): void {
  target.push(...source);
}

function mergePaths(target: IApiPaths, source: IApiPaths): void {
  Object.assign(target, source);
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

function getApiComponentsTagsAndPaths(controllerClass: Class, pathPrefix: string = ''): {
  components: IApiComponents, tags: IApiTag[], paths: IApiPaths
} {
  // Controller class
  const components = getComponents(controllerClass);
  const tags = getTags(controllerClass);
  const paths: IApiPaths = {};
  const controllerPathPrefix = join(pathPrefix, getPath(controllerClass));

  // Sub-controllers
  const controller = createController(controllerClass);
  if (controller.subControllers) {
    for (const subControllerClass of controller.subControllers) {
      const componentsTagsAndPaths = getApiComponentsTagsAndPaths(subControllerClass, controllerPathPrefix);
      mergeTags(tags, componentsTagsAndPaths.tags);
      mergeComponents(components, componentsTagsAndPaths.components);
      mergePaths(paths, componentsTagsAndPaths.paths);
    }
  }

  // Controller methods
  for (const method of getMethods(controllerClass.prototype)) {
    mergeTags(tags, getTags(controllerClass, method));
    mergeComponents(components, getComponents(controllerClass, method));
    const path = getPath(controllerClass, method) || '';
    const httpMethod = getHttpMethod(controllerClass, method);
    if (httpMethod) {
      const keyPath = convertPathTemplating(join(controllerPathPrefix, path));
      paths[keyPath] = {
        ...paths[keyPath],
        [httpMethod.toLowerCase()]: {}
      };
    }
  }

  return { components, tags, paths };
}

export function createOpenApiDocument(controllerClass: Class): IOpenAPI {
  const { components, tags, paths } = getApiComponentsTagsAndPaths(controllerClass);
  checkDuplicatePaths(paths);
  const document = {
    components,
    info: getApiInfo(controllerClass),
    openapi: '3.0.0',
    paths,
    tags,
  };

  return document;
}
