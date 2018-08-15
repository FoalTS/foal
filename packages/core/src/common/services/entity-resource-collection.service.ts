import { getManager } from 'typeorm';

import { AbstractUser } from '../../auth';
import { Class } from '../../core';
import { ObjectDoesNotExist } from '../errors';
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
  // abstract readonly fields: string[];
  readonly connectionName: string = 'default';

  createOne(user: AbstractUser|undefined, record: object): Promise<object> {
    record = Object.assign({}, record);
    delete (record as any).id;
    const entity = this.getManager().create(this.entityClass, record);
    return this.getManager().save(entity);
  }

  createMany(user: AbstractUser|undefined, records: object[]): Promise<object[]> {
    const entities = records.map(record => {
      record = Object.assign({}, record);
      delete (record as any).id;
      return this.getManager().create(this.entityClass, record);
    });
    return this.getManager().save(entities);
  }

  async findById(user: AbstractUser|undefined, query: object): Promise<object> {
    const entity = await this.getManager().findOne(this.entityClass, query);
    if (!entity) {
      throw new ObjectDoesNotExist();
    }
    return entity;
  }

  find(user: AbstractUser|undefined, query: object): Promise<object[]> {
    return this.getManager().find(this.entityClass, query);
  }

  async updateById(user: AbstractUser|undefined, id, query: object, record: object): Promise<void> {
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
    const result = await this.getManager().delete(this.entityClass, query);
    if (result.raw.affectedRows === 0) {
      throw new ObjectDoesNotExist();
    }
  }

  private getManager() {
    return getManager(this.connectionName);
  }

}
