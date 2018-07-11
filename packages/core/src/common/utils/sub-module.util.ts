// 3p
import 'reflect-metadata';

// FoalTS
import { Class } from '../../core';

export function subModule(path: string, moduleClass: Class): Class {
  Reflect.defineMetadata('path', path, moduleClass);
  return moduleClass;
}
