import { getManager } from 'typeorm';

import { Class } from '../../core';
import { ObjectDoesNotExist } from '../errors';
import { ISerializer } from './serializer.interface';

export abstract class EntitySerializer<Entity> implements ISerializer {

  abstract readonly entityClass: Class<Entity>;
  readonly connectionName: string = 'default';

  createOne(record: object): Promise<Entity> {
    record = Object.assign({}, record);
    delete (record as any).id;
    const entity = this.getManager().create(this.entityClass, record);
    return this.getManager().save(entity);
  }

  createMany(records: object[]): Promise<Entity[]> {
    const entities = records.map(record => {
      record = Object.assign({}, record);
      delete (record as any).id;
      return this.getManager().create(this.entityClass, record);
    });
    return this.getManager().save(entities);
  }

  async findOne(query: object): Promise<Entity> {
    const entity = await this.getManager().findOne(this.entityClass, query);
    if (!entity) {
      throw new ObjectDoesNotExist();
    }
    return entity;
  }

  findMany(query: object): Promise<Entity[]> {
    return this.getManager().find(this.entityClass, query);
  }

  async updateOne(query: object, record: object): Promise<void> {
    const result = await this.getManager().update(
      this.entityClass,
      query,
      record
    );
    if (result.raw.affectedRows === 0) {
      throw new ObjectDoesNotExist();
    }
  }

  async removeOne(query: object): Promise<void> {
    const result = await this.getManager().delete(this.entityClass, query);
    if (result.raw.affectedRows === 0) {
      throw new ObjectDoesNotExist();
    }
  }

  private getManager() {
    return getManager(this.connectionName);
  }

}
