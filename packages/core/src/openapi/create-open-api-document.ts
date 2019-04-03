// FoalTS
import { Class } from '../core';
import { getMetadata } from '../core/routes/utils';
import { IOpenAPI } from './interfaces';

export function createOpenApiDocument(controllerClass: Class): IOpenAPI {
  const info = getMetadata('api:info', controllerClass); // TODO: Use a function getApiInfo.
  if (!info) {
    throw new Error('Your root controller should be decorated with @ApiInfo.');
  }

  return {
    info,
    openapi: '3.0.2',
    paths: [],
  };
}
