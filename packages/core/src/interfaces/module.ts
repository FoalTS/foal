import { Controller } from '../classes';
import { PostHook, PreHook } from './hook';

export interface Module {
  controllers?: Controller<string>[];
  modules?: Module[];
  path?: string;
  postHooks?: PostHook[];
  preHooks?: PreHook[];
}
