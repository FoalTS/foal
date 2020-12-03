import { IApiOperation } from '../interfaces';

export function mergeOperations(
  operation1: IApiOperation, operation2: IApiOperation): IApiOperation {
  const operation: IApiOperation = {
    responses: Object.assign({}, operation1.responses, operation2.responses)
  };

  if (operation1.tags || operation2.tags) {
    operation.tags = (operation1.tags || []).concat(operation2.tags || []);
  }

  if (operation2.summary !== undefined) {
    operation.summary = operation2.summary;
  } else if (operation1.summary !== undefined) {
    operation.summary = operation1.summary;
  }

  if (operation2.description !== undefined) {
    operation.description = operation2.description;
  } else if (operation1.description !== undefined) {
    operation.description = operation1.description;
  }

  if (operation1.externalDocs || operation2.externalDocs) {
    operation.externalDocs = operation2.externalDocs || operation1.externalDocs;
  }

  if (operation2.operationId !== undefined) {
    operation.operationId = operation2.operationId;
  } else if (operation1.operationId !== undefined) {
    operation.operationId = operation1.operationId;
  }

  if (operation1.parameters || operation2.parameters) {
    operation.parameters = (operation1.parameters || []).concat(operation2.parameters || []);
  }

  if (operation2.requestBody !== undefined) {
    operation.requestBody = operation2.requestBody;
  } else if (operation1.requestBody !== undefined) {
    operation.requestBody = operation1.requestBody;
  }

  if (operation1.callbacks || operation2.callbacks) {
    operation.callbacks = Object.assign({}, operation1.callbacks, operation2.callbacks);
  }

  if (operation2.deprecated !== undefined) {
    operation.deprecated = operation2.deprecated;
  } else if (operation1.deprecated !== undefined) {
    operation.deprecated = operation1.deprecated;
  }

  if (operation1.security || operation2.security) {
    operation.security = (operation1.security || []).concat(operation2.security || []);
  }

  if (operation1.servers || operation2.servers) {
    operation.servers = (operation1.servers || []).concat(operation2.servers || []);
  }

  return operation;
}
