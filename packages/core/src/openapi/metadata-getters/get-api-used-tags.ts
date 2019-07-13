import { Class } from '../../core';
import { getMetadata } from '../../core/routes/utils';

export function getApiUsedTags(
  controllerClass: Class, propertyKey?: string
): (string | ((controller: any) => string))[] | undefined {
  return getMetadata('api:operation:tags', controllerClass, propertyKey);
}
