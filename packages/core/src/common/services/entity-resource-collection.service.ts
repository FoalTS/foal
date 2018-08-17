import { getManager } from 'typeorm';

import { AbstractUser } from '../../auth';
import { Class } from '../../core';
import { ObjectDoesNotExist, PermissionDenied } from '../errors';
import { IResourceCollection } from './resource-collection.interface';

export type Middleware = (context: { user: AbstractUser, resource, data, params: { /* ... */ } }) => any;

export function middleware(operations: string, middleware: Middleware):
      Partial<Record<keyof IResourceCollection, Middleware>> {
  const result: Partial<Record<keyof IResourceCollection, Middleware>> = {};
  operations
    .replace('*', 'create|find|findById|updateById|modifyById|deleteById')
    .split('|')
    .forEach(str => {
      switch (str) {
        case 'create':
          result.create = middleware;
          break;
        case 'find':
          result.find = middleware;
          break;
        case 'findById':
          result.findById = middleware;
          break;
        case 'updateById':
          result.updateById = middleware;
          break;
        case 'modifyById':
          result.modifyById = middleware;
          break;
        case 'deleteById':
          result.deleteById = middleware;
          break;
        default:
          throw new Error(
            `"${str}" is not a valid operation name.`
            + ' Allowed values are: *|create|find|findById|updateById|modifyById|deleteById'
          );
      }
    });
  return result;
}

/**
 * Create, read, update or delete entities and return representations
 * of them.
 *
 * @export
 * @abstract
 * @class EntityResourceCollection
 * @implements {IResourceCollection}
 * @template Entity
 */
export abstract class EntityResourceCollection implements IResourceCollection {

  abstract readonly entityClass: Class;
  abstract readonly allowedOperations: (keyof IResourceCollection)[];
  readonly middlewares: Partial<Record<keyof IResourceCollection, Middleware>>[] = [];
  readonly connectionName: string = 'default';

  async create(user: AbstractUser|undefined, data: object, params: {}): Promise<object> {
    if (!this.allowedOperations.includes('create')) {
      throw new PermissionDenied();
    }
    if (Array.isArray(data)) {
      const entities = data.map(record => {
        record = Object.assign({}, record);
        delete (record as any).id;
        return this.getManager().create(this.entityClass, record);
      });
      return this.getManager().save(entities);
    }
    data = Object.assign({}, data);
    delete (data as any).id;
    const entity = this.getManager().create(this.entityClass, data);
    return this.getManager().save(entity);
  }

  async findById(user: AbstractUser|undefined, id, params: {}): Promise<object> {
    if (!this.allowedOperations.includes('findById')) {
      throw new PermissionDenied();
    }
    const entity = await this.getManager().findOne(this.entityClass, id);
    if (!entity) {
      throw new ObjectDoesNotExist();
    }
    return entity;
  }

  async find(user: AbstractUser|undefined, params: { query: object }): Promise<object[]> {
    if (!this.allowedOperations.includes('find')) {
      throw new PermissionDenied();
    }
    return this.getManager().find(this.entityClass, params.query);
  }

  async modifyById(user: AbstractUser|undefined, id, data: object, params: {}): Promise<object> {
    if (!this.allowedOperations.includes('modifyById')) {
      throw new PermissionDenied();
    }
    const result = await this.getManager().transaction(async transactionalEntityManager => {
      const obj = await transactionalEntityManager.findOne(this.entityClass, id);
      if (!obj) {
        throw new ObjectDoesNotExist();
      }
      await transactionalEntityManager.update(this.entityClass, obj, data);
      return transactionalEntityManager.findOne(this.entityClass, id);
    });
    return result;
  }

  async updateById(user: AbstractUser|undefined, id, data: object, params: {}): Promise<object> {
    if (!this.allowedOperations.includes('updateById')) {
      throw new PermissionDenied();
    }
    const result = await this.getManager().transaction(async transactionalEntityManager => {
      const obj = await transactionalEntityManager.findOne(this.entityClass, id);
      if (!obj) {
        throw new ObjectDoesNotExist();
      }
      await transactionalEntityManager.update(this.entityClass, obj, data);
      return transactionalEntityManager.findOne(this.entityClass, id);
    });
    return result;
  }

  async deleteById(user: AbstractUser|undefined, id, params: {}): Promise<void> {
    if (!this.allowedOperations.includes('deleteById')) {
      throw new PermissionDenied();
    }
    const obj = await this.getManager().findOne(this.entityClass, id);
    if (!obj) {
      throw new ObjectDoesNotExist();
    }
    await this.getManager().delete(this.entityClass, id);
  }

  private getManager() {
    return getManager(this.connectionName);
  }

}
