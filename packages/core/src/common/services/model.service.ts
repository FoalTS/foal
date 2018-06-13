import { getManager } from 'typeorm';

import { Class } from '../../core';
import { ObjectDoesNotExist } from '../errors';
import { IModelService } from './model-service.interface';

export abstract class ModelService<Model> implements IModelService {

  abstract readonly Model: Class<Model>;
  readonly connectionName: string = 'default';

  createOne(record: object): Promise<Model> {
    record = Object.assign({}, record);
    delete (record as any).id;
    const entity = this.getManager().create(this.Model, record);
    return this.getManager().save(entity);
  }

  createMany(records: object[]): Promise<Model[]> {
    const entities = records.map(record => {
      record = Object.assign({}, record);
      delete (record as any).id;
      return this.getManager().create(this.Model, record);
    });
    return this.getManager().save(entities);
  }

  async findOne(query: object): Promise<Model> {
    const entity = await this.getManager().findOne(this.Model, query);
    if (!entity) {
      throw new ObjectDoesNotExist();
    }
    return entity;
  }

  findMany(query: object): Promise<Model[]> {
    return this.getManager().find(this.Model, query);
  }

  async updateOne(query: object, record: object): Promise<void> {
    const result = await this.getManager().update(
      this.Model,
      query,
      record
    );
    if (result.raw.affectedRows === 0) {
      throw new ObjectDoesNotExist();
    }
  }

  async removeOne(query: object): Promise<void> {
    const result = await this.getManager().delete(this.Model, query);
    if (result.raw.affectedRows === 0) {
      throw new ObjectDoesNotExist();
    }
  }

  private getManager() {
    return getManager(this.connectionName);
  }

}
