import { IModelService, ObjectDoesNotExist } from '@foal/common';

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
  protected dialect: string;

  constructor(name: string, schema: any, connection: SequelizeConnectionService,
              options: object = {}) {
    this.model = connection.sequelize.define(name, schema, options);
    this.dialect = connection.sequelize.getDialect();
  }

  getSequelizeModel() {
    return this.model;
  }

  async createOne(data: ICreatingModel): Promise<IModel & IIdAndTimeStamps> {
    await this.model.sync();

    const model = await this.model.create(data);
    return model.dataValues;
  }

  async createMany(records: ICreatingModel[]): Promise<(IModel & IIdAndTimeStamps)[]> {
    await this.model.sync();

    const result = await this.model.bulkCreate(records, {
      // Ask Postgres to return ids.
      returning: true
    });
    return result.map(e => e.dataValues);
  }

  async findById(id: IdType): Promise<IModel & IIdAndTimeStamps> {
    await this.model.sync();

    const result = await this.model.findById(id);
    if (result === null) {
      throw new ObjectDoesNotExist();
    }
    return result.dataValues;
  }

  async findOne(query: object): Promise<IModel & IIdAndTimeStamps> {
    await this.model.sync();

    const result = await this.model.findOne({
      where: query
    });
    if (result === null) {
      throw new ObjectDoesNotExist();
    }
    return result.dataValues;
  }

  async findAll(query: object): Promise<(IModel & IIdAndTimeStamps)[]> {
    await this.model.sync();

    const models = await this.model.findAll({
      where: query
    });
    return models.map(e => e.dataValues);
  }

  async findByIdAndUpdate(id: IdType,
                          data: Partial<IModel & IIdAndTimeStamps>): Promise<IModel & IIdAndTimeStamps> {
    await this.model.sync();
    this.removeIdAndTimeStamps(data);

    let result = await this.model.update(data, {
      // Ask Postgres to return the affected rows.
      returning: true,
      where: { id },
    });

    if (this.dialect === 'postgres') {
      if (result[0] === 0) {
        throw new ObjectDoesNotExist();
      }
      return result[1].map(e => e.dataValues)[0];
    }

    result = await this.model.findById(id);
    if (result === null) {
      throw new ObjectDoesNotExist();
    }
    return result.dataValues;

  }

  async findOneAndUpdate(query: object,
                         data: Partial<IModel & IIdAndTimeStamps>): Promise<IModel & IIdAndTimeStamps> {
    await this.model.sync();
    this.removeIdAndTimeStamps(data);

    if (this.dialect === 'postgres') {
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

    // The id is required to then fetch unambiguously the updated data.
    const idObj = await this.model.findOne({
      attributes: ['id'],
      where: query
    });
    if (idObj === null) {
      throw new ObjectDoesNotExist();
    }
    const id = idObj.dataValues.id;

    let result = await this.model.update(data, {
      limit: 1,
      where: { id },
    });
    if (result[0] === 0) {
      throw new ObjectDoesNotExist();
    }

    result = await this.model.findById(id);
    if (result === null) {
      throw new ObjectDoesNotExist();
    }
    return result.dataValues;
  }

  async updateMany(query: object, data: Partial<IModel & IIdAndTimeStamps>): Promise<void> {
    await this.model.sync();
    this.removeIdAndTimeStamps(data);

    await this.model.update(data, {
      where: query,
    });
  }

  async findByIdAndReplace(id: IdType,
                           data: IModel & Partial<IIdAndTimeStamps>): Promise<IModel & IIdAndTimeStamps> {
    await this.model.sync();
    this.removeIdAndTimeStamps(data);

    let result = await this.model.update(data, {
      // Ask Postgres to return the affected rows.
      returning: true,
      where: { id },
    });

    if (this.dialect === 'postgres') {
      if (result[0] === 0) {
        throw new ObjectDoesNotExist();
      }
      return result[1].map(e => e.dataValues)[0];
    }

    result = await this.model.findById(id);
    if (result === null) {
      throw new ObjectDoesNotExist();
    }
    return result.dataValues;

  }

  async findOneAndReplace(query: object,
                          data: IModel & Partial<IIdAndTimeStamps>): Promise<IModel & IIdAndTimeStamps> {
    await this.model.sync();
    this.removeIdAndTimeStamps(data);

    if (this.dialect === 'postgres') {
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

    // The id is required to then fetch unambiguously the replaced data.
    const idObj = await this.model.findOne({
      attributes: ['id'],
      where: query
    });
    if (idObj === null) {
      throw new ObjectDoesNotExist();
    }
    const id = idObj.dataValues.id;

    let result = await this.model.update(data, {
      limit: 1,
      where: { id },
    });
    if (result[0] === 0) {
      throw new ObjectDoesNotExist();
    }

    result = await this.model.findById(id);
    if (result === null) {
      throw new ObjectDoesNotExist();
    }
    return result.dataValues;
  }

  async findByIdAndRemove(id: IdType): Promise<void> {
    await this.model.sync();

    const result = await this.model.destroy({
      where: { id }
    });
    if (result === 0) {
      throw new ObjectDoesNotExist();
    }
  }

  async findOneAndRemove(query: object): Promise<void> {
    await this.model.sync();

    const result = await this.model.destroy({
      limit: 1,
      where: query
    });
    if (result === 0) {
      throw new ObjectDoesNotExist();
    }
  }

  async removeMany(query: object): Promise<void> {
    await this.model.sync();

    await this.model.destroy({
      where: query
    });
  }

  protected removeIdAndTimeStamps(o: object): void {
    delete (o as any).id;
    delete (o as any).createdAt;
    delete (o as any).updatedAt;
  }

}
