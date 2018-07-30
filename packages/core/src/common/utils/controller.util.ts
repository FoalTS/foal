// 3p
import 'reflect-metadata';

// FoalTS
import { Class } from '../../core';

export function controller(path: string, controllerClass: Class): Class {
  Reflect.defineMetadata('path', path, controllerClass);
  return controllerClass;
}
