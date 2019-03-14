// 3p
import 'reflect-metadata';

// FoalTS
import { Class } from '../class.interface';

/**
 * Get metadata of a class or a class method.
 *
 * @export
 * @param {string} metadataKey - The name of the metadata.
 * @param {Class} target - The class.
 * @param {string} [propertyKey] - The class method name if relevant.
 * @returns The metadata value.
 */
export function getMetadata(metadataKey: string, target: Class, propertyKey?: string) {
  if (propertyKey === undefined) {
    return Reflect.getMetadata(metadataKey, target);
  }
  return Reflect.getMetadata(metadataKey, target.prototype, propertyKey);
}

/**
 * Get the HTTP method of a controller method.
 *
 * @export
 * @param {Class} target - The controller class.
 * @param {string} [propertyKey] - The method name.
 * @returns {(string|undefined)} - The HTTP method or undefined if none was defined.
 */
export function getHttpMethod(target: Class, propertyKey?: string): string|undefined {
  return getMetadata('httpMethod', target, propertyKey);
}

/**
 * Get the path of a controller method.
 *
 * @export
 * @param {Class} target - The controller class.
 * @param {string} [propertyKey] - The method name.
 * @returns {(string|undefined)} - The path or undefined if none was defined.
 */
export function getPath(target: Class, propertyKey?: string): string|undefined {
  return getMetadata('path', target, propertyKey);
}

/**
 * Join several HTTP request paths together.
 *
 * @export
 * @param {(...(string|undefined)[])} paths - The paths.
 * @returns {string} The resulted path.
 */
export function join(...paths: (string|undefined)[]): string {
  return paths.join('').replace(/(\/)+/g, '/');
}
