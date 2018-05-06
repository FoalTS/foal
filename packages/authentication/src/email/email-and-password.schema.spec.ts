import { Sequelize, SequelizeConnectionService, SequelizeModelService } from '@foal/sequelize';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

const { expect } = chai;

import { UserModelService } from '../user-model.service';
import { emailAndPasswordSchema } from './email-and-password.schema';

describe('emailAndPasswordSchema', () => {

  let connection: SequelizeConnectionService;
  let service: SequelizeModelService<any>;

  const user = process.env.postgres_user !== undefined ?  process.env.postgres_user :  'postgres';
  const password = process.env.postgres_password !== undefined ? process.env.postgres_password : 'password';

  class ConnectionService extends SequelizeConnectionService {
    constructor() {
      super(`postgres://${user}:${password}@localhost:5432/foal_sequelize_test`);
    }
  }

  class UserService extends SequelizeModelService<any> {
    constructor(connection: SequelizeConnectionService) {
      super('users', emailAndPasswordSchema, connection);
    }
  }

  before(() => {
    connection = new ConnectionService();
    service = new UserService(connection);
  });

  beforeEach(() => service.getSequelizeModel().sync({ force: true }));

  it('should create two varchar columns called email and password.', async () => {
    await service.createOne({ email: 'john@jack.com', password: 'foo' });
    let users = await service.findAll({});
    expect(users).to.be.an('array').and.to.have.lengthOf(1);
    expect(users[0]).to.include({ email: 'john@jack.com', password: 'foo' });

    await service.createOne({ email: true, password: 'foo' });
    users = await service.findAll({});
    expect(users).to.be.an('array').and.to.have.lengthOf(2);
    expect(users[1]).to.include({ email: 'true', password: 'foo' });

    await service.createOne({ email: 'john2@jack.com', password: false });
    users = await service.findAll({});
    expect(users).to.be.an('array').and.to.have.lengthOf(3);
    expect(users[2]).to.include({ email: 'john2@jack.com', password: 'false' });
  });

  it('should has a "unique" constraint on the email column.', async () => {
    await service.createOne({ email: 'john@jack.com', password: 'foo' });
    const promise = service.createOne({ email: 'john@jack.com', password: 'foo' });
    return expect(promise).to.be.rejectedWith(Error);
  });

});
