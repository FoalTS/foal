import { getManager } from 'typeorm';

import { AbstractUser } from '../../auth';
import { Class } from '../../core';
import { ObjectDoesNotExist, PermissionDenied } from '../errors';
import { IResourceCollection } from './resource-collection.interface';

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

  async modifyById(user: AbstractUser|undefined, id, data: object, params: {}): Promise<void> {
    if (!this.allowedOperations.includes('modifyById')) {
      throw new PermissionDenied();
    }
    const obj = await this.getManager().findOne(this.entityClass, id);
    if (!obj) {
      throw new ObjectDoesNotExist();
    }
    await this.getManager().update(this.entityClass, obj, data);
  }

  async updateById(user: AbstractUser|undefined, id, data: object, query: object): Promise<void> {
    if (!this.allowedOperations.includes('updateById')) {
      throw new PermissionDenied();
    }
    const obj = await this.getManager().findOne(this.entityClass, id);
    if (!obj) {
      throw new ObjectDoesNotExist();
    }
    await this.getManager().update(this.entityClass, obj, data);
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
