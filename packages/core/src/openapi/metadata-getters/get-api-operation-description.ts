import { Class } from '../../core';
import { getMetadata } from '../../core/routes/utils';

export function getApiOperationDescription(
  controllerClass: Class, propertyKey?: string
): string | ((controller: any) => string) | undefined {
  return getMetadata('api:operation:description', controllerClass, propertyKey);
}
