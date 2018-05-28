import { getManager } from 'typeorm';

import { Class } from '../../core';
import { ObjectDoesNotExist } from '../errors';
import { IModelService } from './model-service.interface';

export abstract class ModelService<Entity> implements IModelService {

  abstract readonly Entity: Class<Entity>;
  readonly connectionName: string = 'default';

  createOne(record: object): Promise<Entity> {
    record = Object.assign({}, record);
    delete (record as any).id;
    const entity = this.getManager().create(this.Entity, record);
    return this.getManager().save(entity);
  }

  createMany(records: object[]): Promise<Entity[]> {
    const entities = records.map(record => {
      record = Object.assign({}, record);
      delete (record as any).id;
      return this.getManager().create(this.Entity, record);
    });
    return this.getManager().save(entities);
  }

  async findOne(query: object): Promise<Entity> {
    const entity = await this.getManager().findOne(this.Entity, query);
    if (!entity) {
      throw new ObjectDoesNotExist();
    }
    return entity;
  }

  findMany(query: object): Promise<Entity[]> {
    return this.getManager().find(this.Entity, query);
  }

  async updateOne(query: object, record: object): Promise<void> {
    const result = await this.getManager().update(
      this.Entity,
      query,
      record
    );
    if (result.raw.affectedRows === 0) {
      throw new ObjectDoesNotExist();
    }
  }

  async removeOne(query: object): Promise<void> {
    const result = await this.getManager().delete(this.Entity, query);
    if (result.raw.affectedRows === 0) {
      throw new ObjectDoesNotExist();
    }
  }

  private getManager() {
    return getManager(this.connectionName);
  }

}
