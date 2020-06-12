import { Class } from '../../class.interface';
import { getMetadata } from '../../routes/utils';
import { IApiTag } from '../interfaces';

export function getApiTags(
  controllerClass: Class, propertyKey?: string
): (IApiTag | ((controller: any) => IApiTag))[] | undefined {
  return getMetadata('api:document:tags', controllerClass, propertyKey);
}
