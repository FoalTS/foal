import { Class } from '../../class.interface';
import { getMetadata } from '../../routes/utils';

export function getApiOperationId(
  controllerClass: Class, propertyKey?: string
): string | ((controller: any) => string) | undefined {
  return getMetadata('api:operation:operationId', controllerClass, propertyKey);
}
