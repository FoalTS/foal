import { Class } from '../../class.interface';
import { getMetadata } from '../../routes/utils';
import { IApiInfo } from '../interfaces';

export function getApiInfo(
  controllerClass: Class
): IApiInfo | ((controller: any) => IApiInfo) | undefined {
  return getMetadata('api:document:info', controllerClass);
}
