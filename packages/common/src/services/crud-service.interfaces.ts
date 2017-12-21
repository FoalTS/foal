import { ObjectType } from '@foal/core';

export interface CreateService {
  create: (data: any, query: ObjectType) => Promise<any>|any;
}

export interface ReadService {
  get: (id: any, query: ObjectType) => Promise<any>|any;
  getAll: (query: ObjectType) => Promise<any>|any;
}

export interface UpdateService {
  replace: (id: any, data: any, query: ObjectType) => Promise<any>|any;
  modify: (id: any, data: any, query: ObjectType) => Promise<any>|any;
}

export interface DeleteService {
  delete: (id: any, query: ObjectType) => Promise<any>|any;
}

export interface CRUDService extends CreateService, ReadService, UpdateService, DeleteService {}

export interface PartialCRUDService {
  create?: (data: any, query: ObjectType) => Promise<any>|any;
  get?: (id: any, query: ObjectType) => Promise<any>|any;
  getAll?: (query: ObjectType) => Promise<any>|any;
  replace?: (id: any, data: any, query: ObjectType) => Promise<any>|any;
  modify?: (id: any, data: any, query: ObjectType) => Promise<any>|any;
  delete?: (id: any, query: ObjectType) => Promise<any>|any;
}
