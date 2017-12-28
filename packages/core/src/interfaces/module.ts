import { Controller } from './controller-and-routes';
import { Hook, Type } from './utils';

export interface FoalModule {
  services?: Type<any>[];
  controllers?: Controller[];
  hooks?: Hook[];
  modules?: { module: FoalModule, path?: string }[];
}
