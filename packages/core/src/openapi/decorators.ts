// 3p
import 'reflect-metadata';

// FoalTS
import {
  IApiCallback, IApiExample, IApiExternalDocumentation, IApiHeader,
  IApiInfo, IApiLink, IApiOperation, IApiParameter, IApiReference,
  IApiRequestBody, IApiResponse, IApiSchema, IApiSecurityRequirement,
  IApiSecurityScheme, IApiServer, IApiTag
} from './interfaces';

function AddMetadataItem<T>(metadataKey: string, item: T) {
  return (target: any, propertyKey?: string) => {
    // Note that propertyKey can be undefined as it's an optional parameter in getMetadata.
    const items: T[] = Reflect.getOwnMetadata(metadataKey, target, propertyKey as string) || [];
    items.unshift(item);
    Reflect.defineMetadata(metadataKey, items, target, propertyKey as string);
  };
}

function AddMetadataProperty(metadataKey: string, key: string, property: any) {
  return (target: any, propertyKey?: string) => {
    // Note that propertyKey can be undefined as it's an optional parameter in getMetadata.
    const o = Reflect.getOwnMetadata(metadataKey, target, propertyKey as string) || {};
    o[key] = property;
    Reflect.defineMetadata(metadataKey, o, target, propertyKey as string);
  };
}

export function ApiInfo(info: IApiInfo) {
  return Reflect.metadata('api:info', info);
}

export function ApiServer(server: IApiServer) {
  return AddMetadataItem('api:servers', server);
}

export function ApiSecurityRequirement(securityRequirement: IApiSecurityRequirement) {
  return AddMetadataItem('api:security', securityRequirement);
}

export function ApiDefineTag(tag: IApiTag) {
  return AddMetadataItem('api:documentTags', tag);
}

export function ApiExternalDoc(externalDoc: IApiExternalDocumentation) {
  return Reflect.metadata('api:externalDocs', externalDoc);
}

/* Operation specific */

export function ApiOperation(operation: IApiOperation) {
  return Reflect.metadata('api:operation', operation);
}

export function ApiUseTag(tag: string) {
  return AddMetadataItem('api:operationTags', tag);
}

export function ApiParameter(parameter: IApiParameter | IApiReference) {
  return AddMetadataItem('api:parameters', parameter);
}

export function ApiRequestBody(requestBody: IApiRequestBody | IApiReference) {
  return Reflect.metadata('api:requestBody', requestBody);
}

export function ApiResponse(
  key: 'default'|'1XX'|'2XX'|'3XX'|'4XX'|'5XX'|number,
  response: IApiResponse | IApiReference
) {
  return AddMetadataProperty('api:responses', key.toString(), response);
}

export function ApiCallback(key: string, callback: IApiCallback | IApiReference) {
  return AddMetadataProperty('api:callbacks', key, callback);
}

export function ApiDeprecated(deprecated: boolean = true) {
  return Reflect.metadata('api:deprecated', deprecated);
}

/* Components */

export function ApiDefineSchema(key: string, schema: IApiSchema | IApiReference) {
  return AddMetadataProperty('api:components:schemas', key, schema);
}

export function ApiDefineResponse(key: string, response: IApiResponse | IApiReference) {
  return AddMetadataProperty('api:components:responses', key, response);
}

export function ApiDefineParameter(key: string, parameter: IApiParameter | IApiReference) {
  return AddMetadataProperty('api:components:parameters', key, parameter);
}

export function ApiDefineExample(key: string, example: IApiExample | IApiReference) {
  return AddMetadataProperty('api:components:examples', key, example);
}

export function ApiDefineRequestBody(key: string, requestBody: IApiRequestBody | IApiReference) {
  return AddMetadataProperty('api:components:requestBodies', key, requestBody);
}

export function ApiDefineHeader(key: string, header: IApiHeader | IApiReference) {
  return AddMetadataProperty('api:components:headers', key, header);
}

export function ApiDefineSecurityScheme(key: string, securityScheme: IApiSecurityScheme | IApiReference) {
  return AddMetadataProperty('api:components:securitySchemes', key, securityScheme);
}

export function ApiDefineLink(key: string, link: IApiLink | IApiReference) {
  return AddMetadataProperty('api:components:links', key, link);
}

export function ApiDefineCallback(key: string, callback: IApiCallback | IApiReference) {
  return AddMetadataProperty('api:components:callbacks', key, callback);
}
