import { Controller } from '../classes';
import { PostHook, PreHook } from './hooks';

export interface Module {
  controllers?: { path?: string, controller: Controller }[];
  modules?: Module[];
  path?: string;
  postHooks?: PostHook[];
  preHooks?: PreHook[];
}
