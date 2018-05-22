import * as Sequelize from 'sequelize';

export abstract class SequelizeConnectionService {
  sequelize: Sequelize;

  constructor(uri: string, options: object = {}) {
    this.sequelize = new Sequelize(uri, Object.assign({
      logging: false,
      operatorsAliases: false,
    }, options));
  }
}
