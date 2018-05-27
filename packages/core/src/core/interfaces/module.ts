import { Controller } from '../controller';
import { PostHook, PreHook } from './hooks';

export interface Module {
  controllers?: Controller<string>[];
  modules?: Module[];
  path?: string;
  postHooks?: PostHook[];
  preHooks?: PreHook[];
}
