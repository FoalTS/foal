import { Class } from '../../core';
import { getMetadata } from '../../core/routes/utils';
import { IApiCallback, IApiReference } from '../interfaces';

export function getApiCallbacks(
  controllerClass: Class, propertyKey?: string
): { [key: string]: IApiCallback | IApiReference | ((controller: any) => IApiCallback | IApiReference) } | undefined {
  return getMetadata('api:operation:callbacks', controllerClass, propertyKey);
}
