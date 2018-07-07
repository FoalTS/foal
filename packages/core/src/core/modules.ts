// 3p
import 'reflect-metadata';

// FoalTS
import { Class } from './interfaces';

export interface IModule {
  controllers?: Class[];
  subModules?: Class<IModule>[];
  entities?: Class[];
}

export function Module(path?: string) {
  return Reflect.metadata('path', path);
}
