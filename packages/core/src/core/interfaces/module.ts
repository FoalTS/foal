import { Controller } from '../controller';
import { Class } from './class';
import { PostHook, PreHook } from './hooks';

export interface Module {
  controllers?: Controller<string>[];
  modules?: Module[];
  models?: Class[];
  path?: string;
  postHooks?: PostHook[];
  preHooks?: PreHook[];
}

export interface IModule {
  controllers?: Controller<string>[];
  subModules?: IModule[];
  entities?: Class[];
}
