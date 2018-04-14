import { Controller } from '../classes';
import { Class } from './utils';

export interface IServiceControllerFactory {
  attachService(path: string, ServiceClass: Class): { path: string, controller: Controller };
}
