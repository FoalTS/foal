import { Service } from '@foal/core';
import { Sequelize, SequelizeConnectionService, SequelizeService } from '@foal/sequelize';

@Service()
export class Connection extends SequelizeConnectionService {
  constructor() {
    super('postgres://postgres:LoicPoullain@localhost:5432/foal_test_db');
  }
}

@Service()
export class User2 extends SequelizeService {

  constructor(protected connection: Connection) {
    super('users', {
      firstName: Sequelize.STRING,
      lastName: Sequelize.STRING
    }, connection);
  }
}
