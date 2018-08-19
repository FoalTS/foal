import { getManager } from 'typeorm';

import { AbstractUser } from '../../auth';
import { Class } from '../../core';
import { ObjectDoesNotExist, PermissionDenied } from '../errors';
import { CollectionParams, IResourceCollection } from './resource-collection.interface';

export type Middleware = (context: { user: AbstractUser|undefined, resource, data, params: CollectionParams }) => any;

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

  async create(user: AbstractUser|undefined, data: object, params: { fields?: string[] }): Promise<object> {
    if (!this.allowedOperations.includes('create')) {
      throw new PermissionDenied();
    }
    for (const middleware of this.middlewares) {
      if (!middleware.create) {
        continue;
      }
      await middleware.create({ user, resource: undefined, data, params });
    }
    if (Array.isArray(data)) {
      const resources = data.map(record => {
        record = Object.assign({}, record);
        delete (record as any).id;
        return this.getManager().create(this.entityClass, record);
      });
      await this.getManager().save(resources);
      if (!params.fields) {
        return resources;
      }

      return resources.map(resource => {
        const representation = {};
        for (const field of params.fields as string[]) {
          representation[field] = resource[field];
        }
        return representation;
      });
    }
    data = Object.assign({}, data);
    delete (data as any).id;

    const resource = this.getManager().create(this.entityClass, data);
    await this.getManager().save(resource);
    if (!params.fields) {
      return resource;
    }

    const representation = {};
    for (const field of params.fields) {
      representation[field] = resource[field];
    }
    return representation;
  }

  async findById(user: AbstractUser|undefined, id, params: {}): Promise<object> {
    if (!this.allowedOperations.includes('findById')) {
      throw new PermissionDenied();
    }
    const resource = await this.getManager().findOne(this.entityClass, id);
    if (!resource) {
      throw new ObjectDoesNotExist();
    }
    for (const middleware of this.middlewares) {
      if (!middleware.findById) {
        continue;
      }
      await middleware.findById({ user, resource, data: undefined, params });
    }
    return resource;
  }

  async find(user: AbstractUser|undefined, params: { query?: object }): Promise<object[]> {
    if (!this.allowedOperations.includes('find')) {
      throw new PermissionDenied();
    }
    for (const middleware of this.middlewares) {
      if (!middleware.find) {
        continue;
      }
      await middleware.find({ user, resource: undefined, data: undefined, params });
    }
    return this.getManager().find(this.entityClass, params.query);
  }

  async modifyById(user: AbstractUser|undefined, id, data: object, params: {}): Promise<object> {
    if (!this.allowedOperations.includes('modifyById')) {
      throw new PermissionDenied();
    }
    const result = await this.getManager().transaction(async transactionalEntityManager => {
      const resource = await transactionalEntityManager.findOne(this.entityClass, id);
      if (!resource) {
        throw new ObjectDoesNotExist();
      }
      for (const middleware of this.middlewares) {
        if (!middleware.modifyById) {
          continue;
        }
        await middleware.modifyById({ user, resource, data, params });
      }
      await transactionalEntityManager.update(this.entityClass, resource, data);
      return transactionalEntityManager.findOne(this.entityClass, id);
    });
    return result;
  }

  async updateById(user: AbstractUser|undefined, id, data: object, params: {}): Promise<object> {
    if (!this.allowedOperations.includes('updateById')) {
      throw new PermissionDenied();
    }
    const result = await this.getManager().transaction(async transactionalEntityManager => {
      const resource = await transactionalEntityManager.findOne(this.entityClass, id);
      if (!resource) {
        throw new ObjectDoesNotExist();
      }
      for (const middleware of this.middlewares) {
        if (!middleware.updateById) {
          continue;
        }
        await middleware.updateById({ user, resource, data, params });
      }
      await transactionalEntityManager.update(this.entityClass, resource, data);
      return transactionalEntityManager.findOne(this.entityClass, id);
    });
    return result;
  }

  async deleteById(user: AbstractUser|undefined, id, params: {}): Promise<void> {
    if (!this.allowedOperations.includes('deleteById')) {
      throw new PermissionDenied();
    }
    await this.getManager().transaction(async transactionalEntityManager => {
      const resource = await transactionalEntityManager.findOne(this.entityClass, id);
      if (!resource) {
        throw new ObjectDoesNotExist();
      }
      for (const middleware of this.middlewares) {
        if (!middleware.deleteById) {
          continue;
        }
        await middleware.deleteById({ user, resource, data: undefined, params });
      }
      await transactionalEntityManager.delete(this.entityClass, id);
    });
  }

  private getManager() {
    return getManager(this.connectionName);
  }

}
