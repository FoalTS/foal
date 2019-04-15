import { Class } from '../../core';
import { getMetadata } from '../../core/routes/utils';
import { IApiInfo } from '../interfaces';

export function getApiInfo(controllerClass: Class): IApiInfo | undefined {
  return getMetadata('api:document:info', controllerClass);
}
