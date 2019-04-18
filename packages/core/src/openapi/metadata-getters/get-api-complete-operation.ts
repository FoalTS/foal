import { Class } from '../../core';
import { IApiOperation } from '../interfaces';
import { getApiCallbacks } from './get-api-callbacks';
import { getApiDeprecated } from './get-api-deprecated';
import { getApiExternalDocs } from './get-api-external-docs';
import { getApiOperation } from './get-api-operation';
import { getApiParameters } from './get-api-parameters';
import { getApiRequestBody } from './get-api-request-body';
import { getApiResponses } from './get-api-responses';
import { getApiSecurity } from './get-api-security';
import { getApiServers } from './get-api-servers';
import { getApiUsedTags } from './get-api-used-tags';

export function getApiCompleteOperation(controllerClass: Class, propertyKey?: string): IApiOperation {
  const operation = getApiOperation(controllerClass, propertyKey);
  const completeOperation: IApiOperation = operation || {
    responses: {},
  };

  const tags = getApiUsedTags(controllerClass, propertyKey);
  if (tags) {
    completeOperation.tags = tags;
  }

  const externalDocs = getApiExternalDocs(controllerClass, propertyKey);
  if (externalDocs) {
    completeOperation.externalDocs = externalDocs;
  }

  const parameters = getApiParameters(controllerClass, propertyKey);
  if (parameters) {
    completeOperation.parameters = parameters;
  }

  const requestBody = getApiRequestBody(controllerClass, propertyKey);
  if (requestBody) {
    completeOperation.requestBody = requestBody;
  }

  const responses = getApiResponses(controllerClass, propertyKey);
  if (responses) {
    completeOperation.responses = responses;
  }

  const callbacks = getApiCallbacks(controllerClass, propertyKey);
  if (callbacks) {
    completeOperation.callbacks = callbacks;
  }

  const deprecated = getApiDeprecated(controllerClass, propertyKey);
  if (deprecated !== undefined) {
    completeOperation.deprecated = deprecated;
  }

  const security = getApiSecurity(controllerClass, propertyKey);
  if (security) {
    completeOperation.security = security;
  }

  const servers = getApiServers(controllerClass, propertyKey);
  if (servers) {
    completeOperation.servers = servers;
  }

  return completeOperation;
}
