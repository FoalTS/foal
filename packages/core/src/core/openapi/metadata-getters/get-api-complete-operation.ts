import { Class } from '../../class.interface';
import { IApiOperation } from '../interfaces';
import { getApiCallbacks } from './get-api-callbacks';
import { getApiDeprecated } from './get-api-deprecated';
import { getApiExternalDocs } from './get-api-external-docs';
import { getApiOperation } from './get-api-operation';
import { getApiOperationDescription } from './get-api-operation-description';
import { getApiOperationId } from './get-api-operation-id';
import { getApiOperationSummary } from './get-api-operation-summary';
import { getApiParameters } from './get-api-parameters';
import { getApiRequestBody } from './get-api-request-body';
import { getApiResponses } from './get-api-responses';
import { getApiSecurity } from './get-api-security';
import { getApiServers } from './get-api-servers';
import { getApiUsedTags } from './get-api-used-tags';

export function getApiCompleteOperation<T>(
  controllerClass: Class<T>, controller: T, propertyKey?: string
): IApiOperation {
  const operation = getApiOperation(controllerClass, propertyKey);
  const completeOperation: IApiOperation = (typeof operation === 'function' ? operation(controller) : operation) || {
    responses: {},
  };

  const description = getApiOperationDescription(controllerClass, propertyKey);
  if (description !== undefined) {
    completeOperation.description = typeof description === 'function' ? description(controller) : description;
  }

  const operationId = getApiOperationId(controllerClass, propertyKey);
  if (operationId !== undefined) {
    completeOperation.operationId = typeof operationId === 'function' ? operationId(controller) : operationId;
  }

  const summary = getApiOperationSummary(controllerClass, propertyKey);
  if (summary !== undefined) {
    completeOperation.summary = typeof summary === 'function' ? summary(controller) : summary;
  }

  const tags = getApiUsedTags(controllerClass, propertyKey);
  if (tags) {
    completeOperation.tags = tags.map(tag => typeof tag === 'function' ? tag(controller) : tag);
  }

  const externalDocs = getApiExternalDocs(controllerClass, propertyKey);
  if (externalDocs) {
    completeOperation.externalDocs = typeof externalDocs === 'function' ? externalDocs(controller) : externalDocs;
  }

  const parameters = getApiParameters(controllerClass, propertyKey);
  if (parameters) {
    completeOperation.parameters = parameters.map(param => typeof param === 'function' ? param(controller) : param);
  }

  const requestBody = getApiRequestBody(controllerClass, propertyKey);
  if (requestBody) {
    completeOperation.requestBody = typeof requestBody === 'function' ? requestBody(controller) : requestBody;
  }

  const responses = getApiResponses(controllerClass, propertyKey);
  if (responses) {
    completeOperation.responses = {};
    for (const key in responses) {
      const response = responses[key];
      completeOperation.responses[key] = typeof response === 'function' ? response(controller) : response;
    }
  }

  const callbacks = getApiCallbacks(controllerClass, propertyKey);
  if (callbacks) {
    completeOperation.callbacks = {};
    for (const key in callbacks) {
      const callback = callbacks[key];
      completeOperation.callbacks[key] = typeof callback === 'function' ? callback(controller) : callback;
    }
  }

  const deprecated = getApiDeprecated(controllerClass, propertyKey);
  if (deprecated !== undefined) {
    completeOperation.deprecated = typeof deprecated === 'function' ? deprecated(controller) : deprecated;
  }

  const security = getApiSecurity(controllerClass, propertyKey);
  if (security) {
    completeOperation.security = security.map(requirement => {
      return typeof requirement === 'function' ? requirement(controller) : requirement;
    });
  }

  const servers = getApiServers(controllerClass, propertyKey);
  if (servers) {
    completeOperation.servers = servers.map(server => typeof server === 'function' ? server(controller) : server);
  }

  return completeOperation;
}
