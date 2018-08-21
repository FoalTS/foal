import { getManager } from 'typeorm';

import { AbstractUser } from '../../auth';
import { Class } from '../../core';
import { ObjectDoesNotExist, PermissionDenied } from '../errors';
import { CollectionParams, IResourceCollection } from './resource-collection.interface';

export type Middleware = (context: { user: AbstractUser|undefined, resource, data, params: CollectionParams }) => any;
export type RelationLoader = (user: AbstractUser|undefined, params: CollectionParams) => string[];

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
  readonly loadedRelations: Partial<Record<'find'|'findById', RelationLoader>> = {};
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

    const resourceOrResources = this.getManager().create(this.entityClass, data);

    if (Array.isArray(resourceOrResources)) {
      resourceOrResources.forEach((resource, index) => this.useSetters(resource, data[index]));
    } else {
      this.useSetters(resourceOrResources, data);
    }

    await this.getManager().save(resourceOrResources);
    if (!params.fields) {
      return resourceOrResources;
    }

    if (Array.isArray(resourceOrResources)) {
      return resourceOrResources.map(
        resource => this.getRepresentation(resource, params.fields as string[])
      );
    }
    return this.getRepresentation(resourceOrResources, params.fields);
  }

  async findById(user: AbstractUser|undefined, id, params: { fields?: string[] }): Promise<object> {
    if (!this.allowedOperations.includes('findById')) {
      throw new PermissionDenied();
    }

    let relations: string[] = [];
    if (this.loadedRelations.findById) {
      relations = this.loadedRelations.findById(user, params);
    }

    const resource = await this.getManager().findOne(this.entityClass, id, { relations });
    if (!resource) {
      throw new ObjectDoesNotExist();
    }

    for (const middleware of this.middlewares) {
      if (!middleware.findById) {
        continue;
      }
      await middleware.findById({ user, resource, data: undefined, params });
    }

    if (!params.fields) {
      return resource;
    }

    return this.getRepresentation(resource, params.fields);
  }

  async find(user: AbstractUser|undefined, params: { query?: object, fields?: string[] }): Promise<object[]> {
    if (!this.allowedOperations.includes('find')) {
      throw new PermissionDenied();
    }

    let relations: string[] = [];
    if (this.loadedRelations.find) {
      relations = this.loadedRelations.find(user, params);
    }

    for (const middleware of this.middlewares) {
      if (!middleware.find) {
        continue;
      }
      await middleware.find({ user, resource: undefined, data: undefined, params });
    }

    const resources = await this.getManager().find(this.entityClass, {
      relations,
      where: params.query
    });

    if (!params.fields) {
      return resources;
    }

    return resources.map(resource => this.getRepresentation(resource, params.fields as string[]));
  }

  async modifyById(user: AbstractUser|undefined, id, data: object, params: { fields?: string[] }): Promise<object> {
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

    if (!params.fields) {
      return result;
    }
    return this.getRepresentation(result, params.fields);
  }

  async updateById(user: AbstractUser|undefined, id, data: object, params: { fields?: string[] }): Promise<object> {
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

    if (!params.fields) {
      return result;
    }
    return this.getRepresentation(result, params.fields);
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

  private getRepresentation(resource, fields: string[]) {
    const representation = {};
    for (const field of fields) {
      representation[field] = resource[field];
    }
    return representation;
  }

  private useSetters(resource, data) {
    // tslint:disable-next-line:forin
    for (const property in data) {
      const setterName = 'set' + property.charAt(0).toUpperCase() + property.slice(1);
      if (typeof resource[setterName] === 'function') {
        resource[setterName](data[property]);
      }
    }
  }

}
