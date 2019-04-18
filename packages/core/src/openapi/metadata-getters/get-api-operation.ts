import { Class } from '../../core';
import { getMetadata } from '../../core/routes/utils';
import { IApiOperation } from '../interfaces';

export function getApiOperation(controllerClass: Class, propertyKey?: string): IApiOperation | undefined {
  return getMetadata('api:operation', controllerClass, propertyKey);
}
