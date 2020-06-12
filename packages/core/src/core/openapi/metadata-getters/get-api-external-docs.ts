import { Class } from '../../class.interface';
import { getMetadata } from '../../routes/utils';
import { IApiExternalDocumentation } from '../interfaces';

export function getApiExternalDocs(
  controllerClass: Class, propertyKey?: string
): IApiExternalDocumentation | ((controller: any) => IApiExternalDocumentation) | undefined {
  return getMetadata('api:documentOrOperation:externalDocs', controllerClass, propertyKey);
}
