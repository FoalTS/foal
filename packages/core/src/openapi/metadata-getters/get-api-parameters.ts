import { Class } from '../../core';
import { getMetadata } from '../../core/routes/utils';
import { IApiParameter, IApiReference } from '../interfaces';

export function getApiParameters(controllerClass: Class, propertyKey?: string):
(IApiParameter | IApiReference | ((controller: any) => IApiParameter | IApiReference))[] | undefined {
  return getMetadata('api:operation:parameters', controllerClass, propertyKey);
}
