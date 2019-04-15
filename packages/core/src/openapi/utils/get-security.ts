import { Class } from '../../core';
import { getMetadata } from '../../core/routes/utils';
import { IApiSecurityRequirement } from '../interfaces';

export function getSecurity(controllerClass: Class, propertyKey?: string): IApiSecurityRequirement[] | undefined {
  return getMetadata('api:documentOrOperation:security', controllerClass, propertyKey);
}
