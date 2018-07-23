// 3p
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { BaseEntity, createConnection, Entity, getConnection, getManager } from 'typeorm';

// FoalTS
import { AbstractUser } from './abstract-user.entity';
import { Group } from './group.entity';
import { Permission } from './permission.entity';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('AbstractUser', () => {

  @Entity()
  class User extends AbstractUser {}

  beforeEach(() => createConnection({
    database: 'test',
    dropSchema: true,
    entities: [User, Group, Permission],
    password: 'test',
    synchronize: true,
    type: 'mysql',
    username: 'test',
  }));

  afterEach(() => getConnection().close());

  it('should have a generated primary key "id".', async () => {
    const user = new User();
    user.groups = [];
    user.userPermissions = [];
    user.permissions = [];
    await getManager().save(user);
    expect(user.id).not.to.equal(undefined);
  });

  it('should have "permissions" which take Permission instances.', async () => {
    const permission = new Permission();
    permission.name = 'permission1';
    permission.codeName = '';
    await getManager().save(permission);

    const user = new User();
    user.permissions = [];
    user.groups = [];
    user.userPermissions = [
      permission
    ];

    await getManager().save(user);

    const user2 = await getManager().findOne(User, user.id, { relations: ['userPermissions'] });
    if (!user2) {
      throw new Error('User should have been saved.');
    }
    expect(user2.userPermissions).to.be.an('array').and.to.have.lengthOf(1);
    expect(user2.userPermissions[0].name).to.equal('permission1');
  });

  it('should have "groups" which take Group instances.', async () => {
    const group = new Group();
    group.name = 'group1';
    await getManager().save(group);

    const user = new User();
    user.permissions = [];
    user.groups = [ group ];
    user.userPermissions = [];

    await getManager().save(user);

    const user2 = await getManager().findOne(User, user.id, { relations: ['groups'] });
    if (!user2) {
      throw new Error('User should have been saved.');
    }
    expect(user2.groups).to.be.an('array').and.to.have.lengthOf(1);
    expect(user2.groups[0].name).to.equal('group1');
  });

  describe('when hasPerm is called', () => {

    it('should return true if the user has the given permission (userPermission).', () => {
      const permission = new Permission();
      permission.codeName = 'admin';

      const user = new User();
      user.userPermissions = [ permission ];

      expect(user.hasPerm('admin')).to.equal(true);
    });

    it('should return true if the user has a group which has the given permission.', () => {
      const permission = new Permission();
      permission.codeName = 'admin';

      const group = new Group();
      group.permissions = [ permission ];

      const user = new User();
      user.groups = [ group ];

      expect(user.hasPerm('admin')).to.equal(true);
    });

    it('should return false if neither the user nor its groups have the given permission.', () => {
      const user = new User();

      expect(user.hasPerm('admin')).to.equal(false);
    });

  });

});
