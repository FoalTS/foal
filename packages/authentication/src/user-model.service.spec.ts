import { Sequelize, SequelizeConnectionService } from '@foal/sequelize';
import { expect } from 'chai';
import { UserModelService } from './user-model.service';

describe('UserModelService', () => {

  let connection: SequelizeConnectionService;
  let service: UserModelService<any>;

  const user = process.env.postgres_user !== undefined ?  process.env.postgres_user :  'postgres';
  const password = process.env.postgres_password !== undefined ? process.env.postgres_password : 'password';

  class ConnectionService extends SequelizeConnectionService {
    constructor() {
      super(`postgres://${user}:${password}@localhost:5432/foal_sequelize_test`);
    }
  }

  class UserService extends UserModelService<any> {
    constructor(connection: SequelizeConnectionService, schema: object = {},
                parsers: ((data: any) => void)[] = [] = []) {
      super(schema, connection, parsers);
    }
  }

  before(() => {
    connection = new ConnectionService();
  });

  // Clear table before each test

  it('should create a table called "users".', () => {
    service = new UserService(connection);
    expect(service.getSequelizeModel().name).to.equal('users');
  });

  describe('should add a column "isAdmin" to the created table that', () => {

    beforeEach(async () => {
      service = new UserService(connection);
      await service.getSequelizeModel().sync({ force: true });
    });

    it('accepts boolean values.', async () => {
      await service.createOne({ isAdmin: true });
      let users = await service.findAll({});
      expect(users).to.be.an('array').and.to.have.lengthOf(1);
      expect(users[0]).to.include({ isAdmin: true });

      await service.createOne({ isAdmin: false });
      users = await service.findAll({});
      expect(users).to.be.an('array').and.to.have.lengthOf(2);
      expect(users[1]).to.include({ isAdmin: false });

      try {
        await service.createOne({ isAdmin: 'a string' });
        throw new Error('Column "isAdmin" should only accept boolean values.');
      } catch (err) {
        if (!(err instanceof Sequelize.DatabaseError)) {
          throw err;
        }
      }
    });

    it('does not accept null values.', async () => {
      try {
        await service.createOne({ isAdmin: null });
        throw new Error('Column "isAdmin" should not accept null value.');
      } catch (err) {
        if (!(err instanceof Sequelize.ValidationError)) {
          throw err;
        }
      }
    });

    it('has a default value if none is specified at creation.', async () => {
      await service.createOne({});
      const users = await service.findAll({});
      expect(users).to.be.an('array').and.to.have.lengthOf(1);
      expect(users[0]).to.include({ isAdmin: false });
    });

  });

  it('should accept a custom schema to define the table without overriding the '
        + 'existing properties.', async () => {
    service = new UserService(connection, {
      // to check that existing prop are not overrided
      isAdmin: { type: Sequelize.BOOLEAN, allowNull: true },
      username: Sequelize.STRING,
    });
    await service.getSequelizeModel().sync({ force: true });

    await service.createOne({ username: 'Jack', isAdmin: false });
    const users = await service.findAll({});
    expect(users).to.be.an('array').and.to.have.lengthOf(1);
    expect(users[0]).to.include({
      isAdmin: false,
      username: 'Jack'
    });

    try {
      await service.createOne({ username: 'Jack', isAdmin: null });
      throw new Error('Custom schema should not override existing properties.');
    } catch (err) {
      if (!(err instanceof Sequelize.ValidationError)) {
        throw err;
      }
    }
  });

  describe('should accept parser functions that', () => {

    beforeEach(async () => {
      const parser1 = data => {
        data.password += 'bar';
      };
      const parser2 = data => {
        data.password += 'foobar';
      };
      service = new UserService(connection, {
        password: Sequelize.STRING
      }, [ parser1, parser2 ]);
      await service.getSequelizeModel().sync({ force: true });
    });

    it('are executed upon createOne call.', async () => {
      const user = await service.createOne({ password: 'foo' });
      expect(user.password).to.equal('foobarfoobar');
    });

    it('are executed upon createMany call.', async () => {
      const users = await service.createMany([{ password: 'foo' }]);
      expect(users).to.be.an('array').and.to.have.lengthOf(1);
      expect(users[0].password).to.equal('foobarfoobar');
    });

  });

});
