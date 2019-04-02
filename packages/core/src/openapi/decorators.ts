// FoalTS
import {
  IApiCallback, IApiExample, IApiExternalDocumentation, IApiHeader,
  IApiInfo, IApiLink, IApiOperation, IApiParameter, IApiReference,
  IApiRequestBody, IApiResponse, IApiSchema, IApiSecurityRequirement,
  IApiSecurityScheme, IApiServer, IApiTag
} from './interfaces';

export function ApiInfo(info: IApiInfo) {
  return Reflect.metadata('api:info', info);
}

export function ApiServer(server: IApiServer) {
  return () => {};
}

export function ApiSecurityRequirement(securityRequirement: IApiSecurityRequirement) {
  return () => {};
}

export function ApiDefineTag(tag: IApiTag) {
  return () => {};
}

export function ApiExternalDoc(externalDoc: IApiExternalDocumentation) {
  return () => {};
}

/* Operation specific */

export function ApiOperation(operation: IApiOperation) {
  return () => {};
}

export function ApiTag(tag: string) {
  return () => {};
}

export function ApiTags(...tags: string[]) {
  return () => {};
}

export function ApiParameter(parameter: IApiParameter | IApiReference) {
  return () => {};
}

export function ApiRequestBody(requestBody: IApiRequestBody | IApiReference) {
  return () => {};
}

export function ApiResponse(
  key: 'default'|'1XX'|'2XX'|'3XX'|'4XX'|'5XX'|number,
  response: IApiResponse | IApiReference
) {
  return () => {};
}

export function ApiCallback(key: string, callback: IApiCallback | IApiReference) {
  return () => {};
}

export function ApiDeprecated(deprecated: boolean = true) {
  return () => {};
}

/* Components */

export function ApiDefineSchema(schema: IApiSchema | IApiReference) {
  return () => {};
}

export function ApiDefineResponse(response: IApiResponse | IApiReference) {
  return () => {};
}

export function ApiDefineParameter(parameter: IApiParameter | IApiReference) {
  return () => {};
}

export function ApiDefineExample(example: IApiExample | IApiReference) {
  return () => {};
}

export function ApiDefineRequestBody(requestBody: IApiRequestBody | IApiReference) {
  return () => {};
}

export function ApiDefineHeader(header: IApiHeader | IApiReference) {
  return () => {};
}

export function ApiDefineSecurityScheme(securityScheme: IApiSecurityScheme | IApiReference) {
  return () => {};
}

export function ApiDefineLink(link: IApiLink | IApiReference) {
  return () => {};
}

export function ApiDefineCallback(callback: IApiCallback | IApiReference) {
  return () => {};
}
