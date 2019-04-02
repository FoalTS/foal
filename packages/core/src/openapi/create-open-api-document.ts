// FoalTS
import { Class } from '../core';
import { IOpenAPI } from './interfaces';

export function createOpenApiDocument(controllerClass: Class): IOpenAPI {
  return {
    info: {
      title: 'eee',
      version: '1.0.0'
    },
    openapi: '3.0.2',
    paths: [],
  };
}
