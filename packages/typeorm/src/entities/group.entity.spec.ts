// std
import { fail, notStrictEqual, ok, strictEqual } from 'assert';

// 3p
import { BaseEntity, DataSource, QueryFailedError } from 'typeorm';

// FoalTS
import { Group } from './group.entity';
import { Permission } from './permission.entity';

function testSuite(type: 'mysql' | 'postgres' | 'sqlite') {

  describe(`with ${type}`, () => {

    let dataSource: DataSource;

    before(async () => {
      switch (type) {
        case 'mysql':
          dataSource = new DataSource({
            database: 'test',
            dropSchema: true,
            entities: [Group, Permission],
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
            entities: [Group, Permission],
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
            entities: [Group, Permission],
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
      await Permission.delete({});
      await Group.delete({});
    });

    it('should extend BaseEntity.', () => {
      const group = new Group();
      strictEqual(group instanceof BaseEntity, true);
    });

    it('should have a generated primary key "id".', async () => {
      const group = new Group();
      group.name = '';
      group.codeName = 'group';
      group.permissions = [];
      await group.save();
      notStrictEqual(group.id, undefined);
    });

    it('should have a "name" and whose length is 80.', async () => {
      const group = new Group();
      group.codeName = 'group';
      group.permissions = [];
      await group.save()
        .then(() => fail('This promise should be rejected.'))
        .catch(err => {
          ok(err instanceof QueryFailedError);
          ok([
            'SQLITE_CONSTRAINT: NOT NULL constraint failed: group.name',
            'SqliteError: NOT NULL constraint failed: group.name',
            'null value in column "name" violates not-null constraint',
            'ER_NO_DEFAULT_FOR_FIELD: Field \'name\' doesn\'t have a default value'
          ].includes(err.message));
        });

      // SQLite does not impose any length restrictions on the length of strings.
      if (type !== 'sqlite') {
        group.name = 'This is a very long long long long long long long long long long long long line1.';

        await group.save()
          .then(() => fail('This promise should be rejected.'))
          .catch(err => {
            ok(err instanceof QueryFailedError);
            ok([
              'value too long for type character varying(80)',
              'ER_DATA_TOO_LONG: Data too long for column \'name\' at row 1'
            ].includes(err.message));
          });
      }
    });

    it('should have a "codeName" which is unique and whose length is 100.', async () => {
      const group = new Group();
      group.name = '';

      await group.save()
        .then(() => fail('The promise should be rejected.'))
        .catch(err => {
          ok(err instanceof QueryFailedError);
          ok([
            'SQLITE_CONSTRAINT: NOT NULL constraint failed: group.codeName',
            'SqliteError: NOT NULL constraint failed: group.codeName',
            'null value in column "codeName" violates not-null constraint',
            'ER_NO_DEFAULT_FOR_FIELD: Field \'codeName\' doesn\'t have a default value'
          ].includes(err.message));
        });

      // SQLite does not impose any length restrictions on the length of strings.
      if (type !== 'sqlite') {
        group.codeName = 'This is a very long long long long long long line.'
          + 'This is a very long long long long long long line.1';

        await group.save()
          .then(() => fail('The promise should be rejected.'))
          .catch(err => {
            ok(err instanceof QueryFailedError);
            ok([
              'value too long for type character varying(100)',
              'ER_DATA_TOO_LONG: Data too long for column \'codeName\' at row 1'
            ].includes(err.message));
          });

      }
      group.codeName = 'foo';
      await group.save();

      const group2 = new Group();
      group2.name = '';
      group2.codeName = 'foo';
      await group2.save()
        .then(() => fail('The promise should be rejected.'))
        .catch(err => {
          ok(err instanceof QueryFailedError);
          strictEqual(
            err.message === 'SQLITE_CONSTRAINT: UNIQUE constraint failed: group.codeName' ||
            err.message === 'SqliteError: UNIQUE constraint failed: group.codeName' ||
            err.message.startsWith('ER_DUP_ENTRY: Duplicate entry \'foo\' for key ') ||
            err.message.startsWith('duplicate key value violates unique constraint')
            , true);
        });
    });

    it('should have "permissions" which take Permission instances.', async () => {
      const permission = new Permission();
      permission.name = 'permission1';
      permission.codeName = '';
      await permission.save();

      const group = new Group();
      group.name = 'group1';
      group.codeName = 'group1';
      group.permissions = [
        permission
      ];

      await group.save();

      const group2 = await Group.findOne({
        where: { id: group.id },
        relations: {
          permissions: true
        }
      });
      if (!group2) {
        throw new Error('Group should have been saved.');
      }
      strictEqual(group2.name, 'group1');

      ok(Array.isArray(group2.permissions));
      strictEqual(group2.permissions.length, 1);
      strictEqual(group2.permissions[0].name, 'permission1');
    });

  });

}

describe('UserWithPermissions', () => {

  testSuite('mysql');
  testSuite('sqlite');
  testSuite('postgres');

});
