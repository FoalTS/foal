import * as bodyParser from 'body-parser';
import * as express from 'express';

import { Foal, newExpressDecorator, rest, Service } from '@foal/core';
import { Sequelize, SequelizeConnectionService, SequelizeService } from '@foal/sequelize';

@Service()
class Connection extends SequelizeConnectionService {
  constructor() {
    super('postgres://postgres:LoicPoullain@localhost:5432/foal_test_db');
  }
}

@Service()
class User extends SequelizeService {

  constructor(protected connection: Connection) {
    super('users', {
      firstName: Sequelize.STRING,
      lastName: Sequelize.STRING
    }, connection);
  }
}

const app = express();
const foal = new Foal({
  controllerBindings: [ rest.bindController('/users', User) ],
  services: [ User ],
  sharedControllerDecorators: [
    newExpressDecorator(bodyParser.urlencoded({ extended: false })),
    newExpressDecorator(bodyParser.json())
  ]
});
app.use(foal.expressRouter());
app.listen(3000, () => console.log('Listening...'));
