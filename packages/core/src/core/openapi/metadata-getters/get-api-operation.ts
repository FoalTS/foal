import { Class } from '../../class.interface';
import { getMetadata } from '../../routes/utils';
import { IApiOperation } from '../interfaces';

export function getApiOperation(
  controllerClass: Class, propertyKey?: string
): IApiOperation | ((controller: any) => IApiOperation) | undefined {
  return getMetadata('api:operation', controllerClass, propertyKey);
}
