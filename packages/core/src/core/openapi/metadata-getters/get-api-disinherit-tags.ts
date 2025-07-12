import { Class } from '../../class.interface';
import { getMetadata } from '../../routes/utils';

export function getApiDisinheritTags(
  controllerClass: Class, propertyKey?: string
): boolean | undefined {
  return getMetadata('api:operation:disinheritTags', controllerClass, propertyKey);
}