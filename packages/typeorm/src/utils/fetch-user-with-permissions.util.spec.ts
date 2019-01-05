// std
import { notStrictEqual, ok, strictEqual } from 'assert';

// 3p
import { createConnection, Entity, getConnection, getManager } from 'typeorm';

// FoalTS
import { Group, Permission, UserWithPermissions } from '../entities';
import { fetchUserWithPermissions } from './fetch-user-with-permissions.util';

function testSuite(type: 'mysql' | 'mariadb' | 'postgres' | 'sqlite') {

  describe(`with ${type}`, () => {

    @Entity()
    class User extends UserWithPermissions { }

    let user: User;

    before(async () => {
      switch (type) {
        case 'mysql':
        case 'mariadb':
          await createConnection({
            database: 'test',
            dropSchema: true,
            entities: [User, Group, Permission],
            password: 'test',
            synchronize: true,
            type,
            username: 'test',
          });
          break;
        case 'postgres':
          await createConnection({
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
          await createConnection({
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
      const permission1 = new Permission();
      permission1.codeName = 'permission1';
      permission1.name = '';

      const permission2 = new Permission();
      permission2.codeName = 'permission2';
      permission2.name = '';

      const group = new Group();
      group.name = 'group1';
      group.codeName = 'group1';
      group.permissions = [permission1];

      user = new User();
      user.groups = [group];
      user.userPermissions = [permission2];
      await getManager().save([ permission1, permission2, group, user]);
    });

    after(() => getConnection().close());

    it('should return the user fetched from the database (id: number).', async () => {
      const actual = await fetchUserWithPermissions(User)(user.id);
      notStrictEqual(actual, undefined);
      strictEqual((actual as User).id, user.id);
    });

    it('should return the user fetched from the database (id: string).', async () => {
      const actual = await fetchUserWithPermissions(User)(user.id.toString());
      notStrictEqual(actual, undefined);
      strictEqual((actual as User).id, user.id);
    });

    it('should return the user fetched from the database with their groups and permissions.', async () => {
      const actual = await fetchUserWithPermissions(User)(user.id);
      notStrictEqual(actual, undefined);
      strictEqual((actual as User).id, user.id);

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

    it('should return undefined if no user is found in the database.', async () => {
      const actual = await fetchUserWithPermissions(User)(56);
      strictEqual(actual, undefined);
    });

  });

}

describe('fetchUserWithPermissions', () => {

  testSuite('mysql');
  testSuite('mariadb');
  testSuite('sqlite');
  testSuite('postgres');

});
