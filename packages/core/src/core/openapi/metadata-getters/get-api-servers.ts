import { Class } from '../../class.interface';
import { getMetadata } from '../../routes/utils';
import { IApiServer } from '../interfaces';

export function getApiServers(
  controllerClass: Class, propertyKey?: string
): (IApiServer | ((controller: any) => IApiServer))[] | undefined {
  return getMetadata('api:documentOrOperation:servers', controllerClass, propertyKey);
}
