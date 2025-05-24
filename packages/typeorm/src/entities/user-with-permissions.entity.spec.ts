// std
import { notStrictEqual, ok, strictEqual } from 'assert';

// 3p
import { BaseEntity, DataSource, Entity } from 'typeorm';

// FoalTS
import { Group } from './group.entity';
import { Permission } from './permission.entity';
import { UserWithPermissions } from './user-with-permissions.entity';

function testSuite(type: 'mysql' | 'postgres' | 'sqlite') {

  describe(`with ${type}`, () => {

    @Entity()
    class User extends UserWithPermissions { }

    let dataSource: DataSource;

    before(async () => {
      switch (type) {
        case 'mysql':
          dataSource = new DataSource({
            database: 'test',
            dropSchema: true,
            entities: [User, Group, Permission],
            password: 'test',
            port: type === 'mysql' ? 3308 : 3307,
            synchronize: true,
            type,
            username: 'test',
          });
          break;
        case 'postgres':
          dataSource = new DataSource({
            database: 'test',
            dropSchema: true,
            entities: [User, Group, Permission],
            password: 'test',
            synchronize: true,
            type,
            username: 'test',
          });
          break;
        case 'sqlite':
          dataSource = new DataSource({
            database: 'test_db.sqlite',
            dropSchema: true,
            entities: [User, Group, Permission],
            synchronize: true,
            type,
          });
          break;
        default:
          break;
      }
      await dataSource.initialize();
    });

    after(async () => {
      if (dataSource) {
        await dataSource.destroy();
      }
    });

    beforeEach(async () => {
      await Permission.createQueryBuilder().delete().execute();
      await Group.createQueryBuilder().delete().execute();
      await User.createQueryBuilder().delete().execute();
    });

    it('should extend BaseEntity.', () => {
      const user = new User();
      strictEqual(user instanceof BaseEntity, true);
    });

    it('should have a generated primary key "id".', async () => {
      const user = new User();
      user.groups = [];
      user.userPermissions = [];
      await user.save();
      notStrictEqual(user.id, undefined);
    });

    it('should have "permissions" which take Permission instances.', async () => {
      const permission = new Permission();
      permission.name = 'permission1';
      permission.codeName = '';
      await permission.save();

      const user = new User();
      user.groups = [];
      user.userPermissions = [
        permission
      ];

      await user.save();

      const user2 = await User.findOne({
        where: { id: user.id },
        relations: {
          userPermissions: true,
        },
      });
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
      await group.save();

      const user = new User();
      user.groups = [ group ];
      user.userPermissions = [];

      await user.save();

      const user2 = await User.findOne({
        where: { id: user.id },
        relations: {
          groups: true,
        },
      });
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

    describe('has a static "withPerm" method that', () => {

      it('should return all users which have this permission as user permission.', async () => {
        const perm1 = new Permission();
        perm1.codeName = 'perm1';
        perm1.name = 'Permission 1';
        await perm1.save();

        const perm2 = new Permission();
        perm2.codeName = 'perm2';
        perm2.name = 'Permission 2';
        await perm2.save();

        const user1 = new User();
        user1.userPermissions = [ perm1 ];
        await user1.save();

        const user2 = new User();
        user2.userPermissions = [ perm1 ];
        await user2.save();

        const user3 = new User();
        user3.userPermissions = [ perm2 ];
        await user3.save();

        const users = await User.withPerm<User>(perm1.codeName);
        strictEqual(users.length, 2);
        strictEqual(users[0].id, user1.id);
        strictEqual(users[1].id, user2.id);
      });

      it('should return all users which have this permission as group permission.', async () => {
        const perm1 = new Permission();
        perm1.codeName = 'perm1';
        perm1.name = 'Permission 1';
        await perm1.save();

        const perm2 = new Permission();
        perm2.codeName = 'perm2';
        perm2.name = 'Permission 2';
        await perm2.save();

        const group1 = new Group();
        group1.codeName = 'group1';
        group1.name = 'Groupe 1';
        group1.permissions = [ perm1 ];
        await group1.save();

        const group2 = new Group();
        group2.codeName = 'group2';
        group2.name = 'Groupe 2';
        group2.permissions = [ perm2 ];
        await group2.save();

        const user1 = new User();
        user1.groups = [ group1 ];
        await user1.save();

        const user2 = new User();
        user2.groups = [ group1 ];
        await user2.save();

        const user3 = new User();
        user3.groups = [ group2 ];
        await user3.save();

        const users = await User.withPerm<User>(perm1.codeName);
        strictEqual(users.length, 2);
        strictEqual(users[0].id, user1.id);
        strictEqual(users[1].id, user2.id);
      });

      it('should return instances of the concrete class.', async () => {
        const perm1 = new Permission();
        perm1.codeName = 'perm1';
        perm1.name = 'Permission 1';
        await perm1.save();

        const user1 = new User();
        user1.userPermissions = [ perm1 ];
        await user1.save();

        const users = await User.withPerm<User>(perm1.codeName);
        strictEqual(users.length, 1);
        strictEqual(users[0] instanceof User, true);
      });

    });

    describe('has a static "findOneWithPermissionsBy" method that', () => {
      let user: User;

      beforeEach(async () => {
        const permission1 = new Permission();
        permission1.codeName = 'permission1';
        permission1.name = '';
        await permission1.save();

        const permission2 = new Permission();
        permission2.codeName = 'permission2';
        permission2.name = '';
        await permission2.save();

        const group = new Group();
        group.name = 'group1';
        group.codeName = 'group1';
        group.permissions = [permission1];
        await group.save();

        user = new User();
        user.groups = [group];
        user.userPermissions = [permission2];
        await user.save();
      });

      it('should return the user fetched from the database.', async () => {
        const actual = await User.findOneWithPermissionsBy({ id: user.id });
        if (actual === null) {
          throw new Error('The user should not be null.');
        }
        strictEqual(actual.id, user.id);
      });

      it('should return the user fetched from the database with their groups and permissions.', async () => {
        const actual = await User.findOneWithPermissionsBy({ id: user.id });
        if (actual === null) {
          throw new Error('The user should not be null.');
        }
        strictEqual(actual.id, user.id);

        ok(Array.isArray(actual.userPermissions), 'userPermissions is not an array');
        strictEqual(actual.userPermissions.length, 1);
        strictEqual(actual.userPermissions[0].codeName, 'permission2');

        ok(Array.isArray(actual.groups), 'groups is not an array');
        strictEqual(actual.groups.length, 1);
        strictEqual(actual.groups[0].name, 'group1');

        ok(Array.isArray(actual.groups[0].permissions), 'groups[0].permissions is not an array');
        strictEqual(actual.groups[0].permissions.length, 1);
        strictEqual(actual.groups[0].permissions[0].codeName, 'permission1');
      });

      it('should return null if no user is found in the database.', async () => {
        const actual = await User.findOneWithPermissionsBy({ id: 56 });
        strictEqual(actual, null);
      });

    });

  });

}

describe('UserWithPermissions', () => {

  testSuite('mysql');
  testSuite('sqlite');
  testSuite('postgres');

});
