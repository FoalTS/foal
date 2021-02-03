// 3p
import 'reflect-metadata';

/**
 * HTTP methods available.
 */
export type HttpMethod = 'ALL' | 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

/**
 * Decorator specifying that a controller method handles requests matching all HTTP verbs.
 *
 * @export
 * @param {string} [path] - The path of the request.
 * @returns The decorator.
 */
export function All(path?: string) {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata('httpMethod', 'ALL', target, propertyKey);
    Reflect.defineMetadata('path', path, target, propertyKey);
  };
}

/**
 * Decorator specifying that a controller method handles HEAD requests.
 *
 * @export
 * @param {string} [path] - The path of the request.
 * @returns The decorator.
 */
export function Head(path?: string) {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata('httpMethod', 'HEAD', target, propertyKey);
    Reflect.defineMetadata('path', path, target, propertyKey);
  };
}

/**
 * Decorator specifying that a controller method handles OPTIONS requests.
 *
 * @export
 * @param {string} [path] - The path of the request.
 * @returns The decorator.
 */
export function Options(path?: string) {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata('httpMethod', 'OPTIONS', target, propertyKey);
    Reflect.defineMetadata('path', path, target, propertyKey);
  };
}

/**
 * Decorator specifying that a controller method handles GET requests.
 *
 * @export
 * @param {string} [path] - The path of the request.
 * @returns The decorator.
 */
export function Get(path?: string) {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata('httpMethod', 'GET', target, propertyKey);
    Reflect.defineMetadata('path', path, target, propertyKey);
  };
}

/**
 * Decorator specifying that a controller method handles POST requests.
 *
 * @export
 * @param {string} [path] - The path of the request.
 * @returns The decorator.
 */
export function Post(path?: string) {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata('httpMethod', 'POST', target, propertyKey);
    Reflect.defineMetadata('path', path, target, propertyKey);
  };
}

/**
 * Decorator specifying that a controller method handles PUT requests.
 *
 * @export
 * @param {string} [path] - The path of the request.
 * @returns The decorator.
 */
export function Put(path?: string) {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata('httpMethod', 'PUT', target, propertyKey);
    Reflect.defineMetadata('path', path, target, propertyKey);
  };
}

/**
 * Decorator specifying that a controller method handles PATCH requests.
 *
 * @export
 * @param {string} [path] - The path of the request.
 * @returns The decorator.
 */
export function Patch(path?: string) {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata('httpMethod', 'PATCH', target, propertyKey);
    Reflect.defineMetadata('path', path, target, propertyKey);
  };
}

/**
 * Decorator specifying that a controller method handles DELETE requests.
 *
 * @export
 * @param {string} [path] - The path of the request.
 * @returns The decorator.
 */
export function Delete(path?: string) {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata('httpMethod', 'DELETE', target, propertyKey);
    Reflect.defineMetadata('path', path, target, propertyKey);
  };
}
