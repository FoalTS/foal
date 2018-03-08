import { IModelService, ObjectDoesNotExist } from '@foal/common';
import { ObjectType } from '@foal/core';

import { SequelizeConnectionService } from './sequelize-connection.service';

export interface DefaultIdAndTimeStamps {
  id: number;
  createdAt: Date;
  updateAt: Date;
}

export abstract class SequelizeModelService<IModel, ICreatingModel = IModel,
    IIdAndTimeStamps extends { id: any } = DefaultIdAndTimeStamps, IdType = number>
    implements IModelService<IModel, ICreatingModel, IIdAndTimeStamps, IdType> {
  protected model: any;

  constructor(name: string, schema: any, connection: SequelizeConnectionService,
              options: ObjectType = {}) {
    this.model = connection.sequelize.define(name, schema, options);
  }

  public getSequelizeModel() {
    return this.model;
  }

  public async createOne(data: ICreatingModel): Promise<IModel & IIdAndTimeStamps> {
    await this.model.sync();

    const model = await this.model.create(data);
    return model.dataValues;
  }

  public async createMany(records: ICreatingModel[]): Promise<(IModel & IIdAndTimeStamps)[]> {
    await this.model.sync();

    const result = await this.model.bulkCreate(records, {
      // Ask Postgres to return ids.
      returning: true
    });
    return result.map(e => e.dataValues);
  }

  public async findById(id: IdType): Promise<IModel & IIdAndTimeStamps> {
    await this.model.sync();

    const result = await this.model.findById(id);
    if (result === null) {
      throw new ObjectDoesNotExist();
    }
    return result.dataValues;
  }

  public async findOne(query: ObjectType): Promise<IModel & IIdAndTimeStamps> {
    await this.model.sync();

    const result = await this.model.findOne({
      where: query
    });
    if (result === null) {
      throw new ObjectDoesNotExist();
    }
    return result.dataValues;
  }

  public async findAll(query: ObjectType): Promise<(IModel & IIdAndTimeStamps)[]> {
    await this.model.sync();

    const models = await this.model.findAll({
      where: query
    });
    return models.map(e => e.dataValues);
  }

  public async findByIdAndUpdate(id: IdType,
                                 data: Partial<IModel & IIdAndTimeStamps>): Promise<IModel & IIdAndTimeStamps> {
    await this.model.sync();
    this.removeIdAndTimeStamps(data);

    const result = await this.model.update(data, {
      // Ask Postgres to return the affected rows.
      returning: true,
      where: { id },
    });
    if (result[0] === 0) {
      throw new ObjectDoesNotExist();
    }
    return result[1].map(e => e.dataValues)[0];
  }

  public async findOneAndUpdate(query: ObjectType,
                                data: Partial<IModel & IIdAndTimeStamps>): Promise<IModel & IIdAndTimeStamps> {
    await this.model.sync();
    this.removeIdAndTimeStamps(data);

    const result = await this.model.update(data, {
      limit: 1,
      // Ask Postgres to return the affected rows.
      returning: true,
      where: query,
    });
    if (result[0] === 0) {
      throw new ObjectDoesNotExist();
    }
    return result[1].map(e => e.dataValues)[0];
  }

  public async updateMany(query: ObjectType, data: Partial<IModel & IIdAndTimeStamps>): Promise<void> {
    await this.model.sync();
    this.removeIdAndTimeStamps(data);

    await this.model.update(data, {
      where: query,
    });
  }

  public async findByIdAndReplace(id: IdType,
                                  data: IModel & Partial<IIdAndTimeStamps>): Promise<IModel & IIdAndTimeStamps> {
    await this.model.sync();
    this.removeIdAndTimeStamps(data);

    const result = await this.model.update(data, {
      // Ask Postgres to return the affected rows.
      returning: true,
      where: { id },
    });
    if (result[0] === 0) {
      throw new ObjectDoesNotExist();
    }
    return result[1].map(e => e.dataValues)[0];
  }

  public async findOneAndReplace(query: ObjectType,
                                 data: IModel & Partial<IIdAndTimeStamps>): Promise<IModel & IIdAndTimeStamps> {
    await this.model.sync();
    this.removeIdAndTimeStamps(data);

    const result = await this.model.update(data, {
      limit: 1,
      // Ask Postgres to return the affected rows.
      returning: true,
      where: query,
    });
    if (result[0] === 0) {
      throw new ObjectDoesNotExist();
    }
    return result[1].map(e => e.dataValues)[0];
  }

  public async findByIdAndRemove(id: IdType): Promise<void> {
    await this.model.sync();

    const result = await this.model.destroy({
      where: { id }
    });
    if (result === 0) {
      throw new ObjectDoesNotExist();
    }
  }

  public async findOneAndRemove(query: ObjectType): Promise<void> {
    await this.model.sync();

    const result = await this.model.destroy({
      limit: 1,
      where: query
    });
    if (result === 0) {
      throw new ObjectDoesNotExist();
    }
  }

  public async removeMany(query: ObjectType): Promise<void> {
    await this.model.sync();

    await this.model.destroy({
      where: query
    });
  }

  protected removeIdAndTimeStamps(o: ObjectType): void {
    delete o.id;
    delete o.createdAt;
    delete o.updateAt;
  }

}
