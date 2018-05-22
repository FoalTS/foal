import { getManager } from 'typeorm';

import { IModelService, ObjectDoesNotExist } from '@foal/common';
import { Class } from '@foal/core';

export class ModelService<Entity> implements IModelService {
  private manager = getManager();

  constructor(private Entity: Class<Entity>) {}

  createOne(record: object): Promise<Entity> {
    const entity = this.manager.create(this.Entity, record);
    return this.manager.save(entity);
  }

  createMany(records: object[]): Promise<Entity[]> {
    const entities = records.map(record => this.manager.create(this.Entity, record));
    return this.manager.save(entities);
  }

  async findOne(query: object): Promise<Entity> {
    const entity = await this.manager.findOne(this.Entity, query);
    if (!entity) {
      throw new ObjectDoesNotExist();
    }
    return entity;
  }

  findMany(query: object): Promise<Entity[]> {
    return this.manager.find(this.Entity, query);
  }

  async updateOne(record: object, query: object): Promise<void> {
    await this.manager.update(this.Entity, query, record);
  }

  async updateMany(records: object[], queries: object[]): Promise<void> {
    await this.manager.transaction(manager => Promise.all(
      records.map((record, i) => {
        return this.manager.update(this.Entity, queries[i], record);
      })
    ));
  }

  async removeOne(query: object): Promise<void> {
    await this.manager.delete(this.Entity, query);
  }

  async removeMany(query: object): Promise<void> {
    await this.manager.delete(this.Entity, query);
  }
}
