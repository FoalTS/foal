import { Class } from '../interfaces';
import { Controller } from './controller';

export interface IServiceControllerFactory {
  attachService(path: string, ServiceClass: Class, ...args: any[]): Controller<string>;
}
