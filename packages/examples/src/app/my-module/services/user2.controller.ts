import { Service } from '@foal/core';
import { Sequelize, SequelizeConnectionService, SequelizeService } from '@foal/sequelize';

export interface User {
  firstName: string;
  lastName: string;
}

@Service()
export class Connection extends SequelizeConnectionService {
  constructor() {
    super('postgres://postgres:LoicPoullain@localhost:5432/foal_test_db');
  }
}

@Service()
export class User2 extends SequelizeService<User> {

  constructor(protected connection: Connection) {
    super('users', {
      firstName: Sequelize.STRING,
      lastName: Sequelize.STRING
    }, connection);
  }
}
