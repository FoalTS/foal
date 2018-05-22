import { IModelService } from '@foal/common';
import { Class } from '@foal/core';

export class ModelService<Entity> implements IModelService {

  constructor(private Entity: Class<Entity>) {}

  async createOne(record: object): Promise<Entity> {
    return new this.Entity();
  }

  async createMany(records: object[]): Promise<Entity[]> {
    return [];
  }

  async findOne(query: object): Promise<Entity> {
    return new this.Entity();
  }

  async findMany(query: object): Promise<Entity[]> {
    return [];
  }

  async updateOne(record: object, query: object): Promise<Entity> {
    return new this.Entity();
  }

  async updateMany(records: object[], query: object[]): Promise<Entity[]> {
    return [];
  }

  async removeOne(query: object): Promise<void> {

  }

  async removeMany(query: object): Promise<void> {

  }
}
