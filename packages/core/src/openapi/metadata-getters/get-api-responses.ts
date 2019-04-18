import { Class } from '../../core';
import { getMetadata } from '../../core/routes/utils';
import { IApiResponses } from '../interfaces';

export function getApiResponses(controllerClass: Class, propertyKey?: string): IApiResponses | undefined {
  return getMetadata('api:operation:responses', controllerClass, propertyKey);
}
