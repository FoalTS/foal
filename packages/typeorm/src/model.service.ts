import { IModelService } from '@foal/common';
import { Class, Service } from '@foal/core';

export class ModelService<Entity> implements IModelService {

  constructor(private Entity: Class<Entity>) {}

  public async createOne(record: object): Promise<Entity> {
    return new this.Entity();
  }

  public async createMany(records: object[]): Promise<Entity[]> {
    return [];
  }

  public async findOne(query: object): Promise<Entity> {
    return new this.Entity();
  }

  public async findMany(query: object): Promise<Entity[]> {
    return [];
  }

  public async updateOne(record: object, query: object): Promise<Entity> {
    return new this.Entity();
  }

  public async updateMany(records: object[], query: object[]): Promise<Entity[]> {
    return [];
  }

  public async removeOne(query: object): Promise<void> {

  }

  public async removeMany(query: object): Promise<void> {

  }
}
