// std
import { notStrictEqual, ok, strictEqual } from 'assert';

// 3p
import { BaseEntity, createConnection, Entity, getConnection, getManager } from 'typeorm';

// FoalTS
import { Group } from './group.entity';
import { Permission } from './permission.entity';
import { UserWithPermissions } from './user-with-permissions.entity';

describe('UserWithPermissions', () => {

  @Entity()
  class User extends UserWithPermissions {}

  beforeEach(function() {
    // Increase timeout to make the test pass on Github Actions VM.
    this.timeout(4000);
    return createConnection({
      database: 'test',
      dropSchema: true,
      entities: [User, Group, Permission],
      password: 'test',
      port: 3308,
      synchronize: true,
      type: 'mysql',
      username: 'test',
    });
  });

  afterEach(() => getConnection().close());

  it('should extend BaseEntity.', () => {
    const user = new User();
    strictEqual(user instanceof BaseEntity, true);
  });

  it('should have a generated primary key "id".', async () => {
    const user = new User();
    user.groups = [];
    user.userPermissions = [];
    await getManager().save(user);
    notStrictEqual(user.id, undefined);
  });

  it('should have "permissions" which take Permission instances.', async () => {
    const permission = new Permission();
    permission.name = 'permission1';
    permission.codeName = '';
    await getManager().save(permission);

    const user = new User();
    user.groups = [];
    user.userPermissions = [
      permission
    ];

    await getManager().save(user);

    const user2 = await getManager().findOne(User, user.id, { relations: ['userPermissions'] });
    if (!user2) {
      throw new Error('User should have been saved.');
    }

    ok(Array.isArray(user2.userPermissions));
    strictEqual(user2.userPermissions.length, 1);

    strictEqual(user2.userPermissions[0].name, 'permission1');
  });

  it('should have "groups" which take Group instances.', async () => {
    const group = new Group();
    group.name = 'group1';
    group.codeName = 'group1';
    await getManager().save(group);

    const user = new User();
    user.groups = [ group ];
    user.userPermissions = [];

    await getManager().save(user);

    const user2 = await getManager().findOne(User, user.id, { relations: ['groups'] });
    if (!user2) {
      throw new Error('User should have been saved.');
    }

    ok(Array.isArray(user2.groups));
    strictEqual(user2.groups.length, 1);
    strictEqual(user2.groups[0].name, 'group1');
  });

  describe('when hasPerm is called', () => {

    it('should return true if the user has the given permission (userPermission).', () => {
      const permission = new Permission();
      permission.codeName = 'admin';

      const user = new User();
      user.userPermissions = [ permission ];

      strictEqual(user.hasPerm('admin'), true);
    });

    it('should return true if the user has a group which has the given permission.', () => {
      const permission = new Permission();
      permission.codeName = 'admin';

      const group = new Group();
      group.permissions = [ permission ];

      const user = new User();
      user.groups = [ group ];

      strictEqual(user.hasPerm('admin'), true);
    });

    it('should return false if neither the user nor its groups have the given permission.', () => {
      const user = new User();

      strictEqual(user.hasPerm('admin'), false);
    });

  });

});
