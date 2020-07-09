import { Class } from '../../class.interface';
import { getMetadata } from '../../routes/utils';
import { IApiReference, IApiRequestBody } from '../interfaces';

export function getApiRequestBody(controllerClass: Class, propertyKey?: string):
IApiRequestBody | IApiReference | ((controller: any) => IApiRequestBody | IApiReference) | undefined {
  return getMetadata('api:operation:requestBody', controllerClass, propertyKey);
}
