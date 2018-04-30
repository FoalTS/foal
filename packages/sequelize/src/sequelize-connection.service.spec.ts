import { expect } from 'chai';
import * as Sequelize from 'sequelize';

import { SequelizeConnectionService } from './sequelize-connection.service';

describe('SequelizeConnectionService', () => {

  class ConcreteSequelizeConnectionService extends SequelizeConnectionService {}

  describe('with PostgreSQL', () => {
    const user = process.env.postgres_user !== undefined ?  process.env.postgres_user :  'postgres';
    const password = process.env.postgres_password !== undefined ? process.env.postgres_password : 'password';

    it('should create a Sequelize connection for the given uri.', () => {
      const uri = `postgres://${user}:${password}@localhost:5432/foal_sequelize_test`;
      const service = new ConcreteSequelizeConnectionService(uri);
      expect(service.sequelize).to.be.an.instanceOf(Sequelize);
    });
  });

  describe('with SQLite', () => {
    it('should create a Sequelize connection for the given uri.', () => {
      const uri = 'sqlite://foal_sequelize_test.db';
      const service = new ConcreteSequelizeConnectionService(uri);
      expect(service.sequelize).to.be.an.instanceOf(Sequelize);
    });
  });

  // describe('with Microsoft SQL Server', () => {
  //   it('should create a Sequelize connection for the given uri.', () => {
  //     const uri = 'mssql://sa:yourStrong(!)Password@localhost:1433/foal_sequelize_test`';
  //     const service = new ConcreteSequelizeConnectionService(uri);
  //     expect(service.sequelize).to.be.an.instanceOf(Sequelize);
  //   });
  // });

  // Testing the options and default options is not obvious.

});
