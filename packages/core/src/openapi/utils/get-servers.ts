import { Class } from '../../core';
import { getMetadata } from '../../core/routes/utils';
import { IApiServer } from '../interfaces';

export function getServers(controllerClass: Class, propertyKey?: string): IApiServer[] | undefined {
  return getMetadata('api:documentOrOperation:servers', controllerClass, propertyKey);
}
