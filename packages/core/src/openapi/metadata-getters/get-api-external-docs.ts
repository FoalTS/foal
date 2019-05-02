import { Class } from '../../core';
import { getMetadata } from '../../core/routes/utils';
import { IApiExternalDocumentation } from '../interfaces';

export function getApiExternalDocs(controllerClass: Class, propertyKey?: string):
IApiExternalDocumentation | undefined {
  return getMetadata('api:documentOrOperation:externalDocs', controllerClass, propertyKey);
}
