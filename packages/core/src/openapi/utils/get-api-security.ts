import { Class } from '../../core';
import { getMetadata } from '../../core/routes/utils';
import { IApiSecurityRequirement } from '../interfaces';

export function getApiSecurity(controllerClass: Class, propertyKey?: string): IApiSecurityRequirement[] | undefined {
  return getMetadata('api:documentOrOperation:security', controllerClass, propertyKey);
}
