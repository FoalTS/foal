// std
import { ok, rejects, strictEqual } from 'assert';

// 3p
import { ServiceManager } from '@foal/core';
import { DataSource, Entity } from 'typeorm';

// FoalTS
import { Group, Permission, UserWithPermissions } from '../entities';
import { fetchUserWithPermissions } from './fetch-user-with-permissions.util';

function testSuite(type: 'mysql' | 'mariadb' | 'postgres' | 'sqlite' | 'better-sqlite3') {

  describe(`with ${type}`, () => {

    @Entity()
    class User extends UserWithPermissions { }

    let dataSource: DataSource;

    let user: User;

    before(async function() {
      switch (type) {
        case 'mysql':
        case 'mariadb':
          // Increase timeout to make the test pass on Github Actions VM.
          this.timeout(6000);
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
        case 'better-sqlite3':
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

    after(async () => {
      if (dataSource) {
        await dataSource.destroy();
      }
    });

    it('should return the user fetched from the database (id: number).', async () => {
      const actual = await fetchUserWithPermissions(User)(user.id, new ServiceManager());
      if (actual === null) {
        throw new Error('The user should not be null.');
      }
      strictEqual(actual.id, user.id);
    });

    it('should throw an error if the ID is a string and connot be parsed to a number.', async () => {
      await rejects(
        () => fetchUserWithPermissions(User)('xxxxx', new ServiceManager()),
        new Error('Suspicious operation: the provided ID cannot be parsed to a number.'),
      );
    });

    it('should return the user fetched from the database (id: string).', async () => {
      const actual = await fetchUserWithPermissions(User)(user.id.toString(), new ServiceManager());
      if (actual === null) {
        throw new Error('The user should not be null.');
      }
      strictEqual(actual.id, user.id);
    });

    it('should return the user fetched from the database with their groups and permissions.', async () => {
      const actual = await fetchUserWithPermissions(User)(user.id, new ServiceManager());
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
      const actual = await fetchUserWithPermissions(User)(56, new ServiceManager());
      strictEqual(actual, null);
    });

  });

}

describe('fetchUserWithPermissions', () => {

  testSuite('mysql');
  testSuite('mariadb');
  testSuite('sqlite');
  testSuite('better-sqlite3');
  testSuite('postgres');

});
