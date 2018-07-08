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

export function join(...paths: (string|undefined)[]): string {
  return paths.join('').replace(/(\/)+/g, '/');
}
