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

  async create(user: AbstractUser|undefined, data: object): Promise<object> {
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

  async findById(user: AbstractUser|undefined, id, query: object): Promise<object> {
    if (!this.allowedOperations.includes('findById')) {
      throw new PermissionDenied();
    }
    const entity = await this.getManager().findOne(this.entityClass, query);
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

  async updateById(user: AbstractUser|undefined, id, query: object, record: object): Promise<void> {
    if (!this.allowedOperations.includes('updateById')) {
      throw new PermissionDenied();
    }
    const result = await this.getManager().update(
      this.entityClass,
      query,
      record
    );
    if (result.raw.affectedRows === 0) {
      throw new ObjectDoesNotExist();
    }
  }

  async deleteById(user: AbstractUser|undefined, id, query: object): Promise<void> {
    if (!this.allowedOperations.includes('deleteById')) {
      throw new PermissionDenied();
    }
    const result = await this.getManager().delete(this.entityClass, query);
    if (result.raw.affectedRows === 0) {
      throw new ObjectDoesNotExist();
    }
  }

  private getManager() {
    return getManager(this.connectionName);
  }

}
