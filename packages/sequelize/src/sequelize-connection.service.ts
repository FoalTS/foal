import { ObjectType } from '@foal/core';
import * as Sequelize from 'sequelize';

const DEFAULT_OPTIONS = {
  logging: false
};

export abstract class SequelizeConnectionService {
  public sequelize: Sequelize;

  constructor(dbName: string, username: string|null, password: string|null, options: ObjectType) {
    this.sequelize = new Sequelize(dbName, username, password, Object.assign({}, DEFAULT_OPTIONS, options));
  }
}
