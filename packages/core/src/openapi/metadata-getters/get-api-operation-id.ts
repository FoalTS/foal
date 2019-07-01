import { Class } from '../../core';
import { getMetadata } from '../../core/routes/utils';

export function getApiOperationId(
  controllerClass: Class, propertyKey?: string
): string | ((controller: any) => string) | undefined {
  return getMetadata('api:operation:operationId', controllerClass, propertyKey);
}
