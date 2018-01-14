import { ObjectType } from '@foal/core';
import * as Sequelize from 'sequelize';

export abstract class SequelizeConnectionService {
  public sequelize: Sequelize;

  // Add params in the future.
  constructor(uri: string, options: ObjectType = {}) {
    this.sequelize = new Sequelize(uri, Object.assign({
      logging: false
    }, options));
  }
}
