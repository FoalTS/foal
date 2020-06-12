import { Class } from '../../class.interface';
import { getMetadata } from '../../routes/utils';
import { IApiResponses } from '../interfaces';
import { Dynamic } from '../utils';

export function getApiResponses(controllerClass: Class, propertyKey?: string): Dynamic<IApiResponses> | undefined {
  return getMetadata('api:operation:responses', controllerClass, propertyKey);
}
