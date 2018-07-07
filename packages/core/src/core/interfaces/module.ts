import { Class } from '../class.interface';
import { Controller } from '../controller';
import { PostHook, PreHook } from './hooks';

export interface Module {
  controllers?: Controller<string>[];
  modules?: Module[];
  models?: Class[];
  path?: string;
  postHooks?: PostHook[];
  preHooks?: PreHook[];
}
