import { Class } from '../../core';
import { getMetadata } from '../../core/routes/utils';

export function getApiDeprecated(controllerClass: Class, propertyKey?: string): boolean | undefined {
  return getMetadata('api:operation:deprecated', controllerClass, propertyKey);
}
