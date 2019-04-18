import { Class } from '../../core';
import { getMetadata } from '../../core/routes/utils';
import { IApiReference, IApiRequestBody } from '../interfaces';

export function getApiRequestBody(controllerClass: Class, propertyKey?: string):
IApiRequestBody | IApiReference | undefined {
  return getMetadata('api:operation:requestBody', controllerClass, propertyKey);
}
