import { ObjectType } from '@foal/core';
import * as Sequelize from 'sequelize';

export abstract class SequelizeConnectionService {
  public sequelize: Sequelize;

  constructor(uri: string, options: ObjectType = {}) {
    this.sequelize = new Sequelize(uri, Object.assign({
      logging: false,
      operatorsAliases: false,
    }, options));
  }
}
