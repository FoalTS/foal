import { Controller } from '../classes';
import { Hook } from './hook';

export interface Module {
  controllers?: Controller<string>[];
  modules?: Module[];
  path?: string;
  postHooks?: Hook[];
  preHooks?: Hook[];
}
