// 3p
import 'reflect-metadata';

// FoalTS
import { Class } from '../class.interface';

export function getMetadata(metadataKey: string, target: Class, propertyKey?: string) {
  if (propertyKey === undefined) {
    return Reflect.getMetadata(metadataKey, target);
  }
  return Reflect.getMetadata(metadataKey, target.prototype, propertyKey);
}

export function getHttpMethod(target: Class, propertyKey?: string): string|undefined {
  return getMetadata('httpMethod', target, propertyKey);
}

export function getPath(target: Class, propertyKey?: string): string|undefined {
  return getMetadata('path', target, propertyKey);
}

export function join(...paths: (string|undefined)[]): string {
  return paths.join('').replace(/(\/)+/g, '/');
}
