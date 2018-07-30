// 3p
import 'reflect-metadata';

// FoalTS
import { Class } from './class.interface';

export interface IModule {
  controllers?: Class[];
  subModules?: Class<IModule>[];
}

export function Module(path?: string) {
  return Reflect.metadata('path', path);
}
