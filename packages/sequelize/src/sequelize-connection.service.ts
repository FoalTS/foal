import * as Sequelize from 'sequelize';

export abstract class SequelizeConnectionService {
  public sequelize: Sequelize;

  // Add params in the future.
  constructor(uri: string) {
    this.sequelize = new Sequelize(uri, {
      logging: false
    });
  }
}
