import { Class } from '../../class.interface';
import { getMetadata } from '../../routes/utils';

export function getApiOperationDescription(
  controllerClass: Class, propertyKey?: string
): string | ((controller: any) => string) | undefined {
  return getMetadata('api:operation:description', controllerClass, propertyKey);
}
