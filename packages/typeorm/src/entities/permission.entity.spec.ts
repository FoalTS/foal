// std
import { fail, notStrictEqual, ok, strictEqual } from 'assert';

// 3p
import { BaseEntity, DataSource, QueryFailedError } from 'typeorm';

// FoalTS
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
            entities: [Permission],
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
            entities: [Permission],
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
            entities: [Permission],
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

    beforeEach(async () => Permission.delete({}));

    it('should extend BaseEntity.', () => {
      const permission = new Permission();
      strictEqual(permission instanceof BaseEntity, true);
    });

    it('should have a generated primary key "id".', async () => {
      const permission = new Permission();
      permission.name = '';
      permission.codeName = '';
      await permission.save();
      notStrictEqual(permission.id, undefined);
    });

    it('should have a "name".', () => {
      const permission = new Permission();
      permission.codeName = '';
      return permission.save()
        .then(() => fail('The promise should be rejected.'))
        .catch(err => {
          ok(err instanceof QueryFailedError);
          ok([
            'SQLITE_CONSTRAINT: NOT NULL constraint failed: permission.name',
            'SqliteError: NOT NULL constraint failed: permission.name',
            'null value in column "name" violates not-null constraint',
            'ER_NO_DEFAULT_FOR_FIELD: Field \'name\' doesn\'t have a default value'
          ].includes(err.message));
        });
    });

    it('should have a "codeName" which is unique and whose length is 100.', async () => {
      const permission = new Permission();
      permission.name = '';

      await permission.save()
        .then(() => fail('The promise should be rejected.'))
        .catch(err => {
          ok(err instanceof QueryFailedError);
          ok([
            'SQLITE_CONSTRAINT: NOT NULL constraint failed: permission.codeName',
            'SqliteError: NOT NULL constraint failed: permission.codeName',
            'null value in column "codeName" violates not-null constraint',
            'ER_NO_DEFAULT_FOR_FIELD: Field \'codeName\' doesn\'t have a default value'
          ].includes(err.message));
        });

      // SQLite does not impose any length restrictions on the length of strings.
      if (type !== 'sqlite') {
        permission.codeName = 'This is a very long long long long long long line.'
          + 'This is a very long long long long long long line.1';

        await permission.save()
          .then(() => fail('The promise should be rejected.'))
          .catch(err => {
            ok(err instanceof QueryFailedError);
            ok([
              'value too long for type character varying(100)',
              'ER_DATA_TOO_LONG: Data too long for column \'codeName\' at row 1'
            ].includes(err.message));
          });
      }

      permission.codeName = 'foo';
      await permission.save();

      const permission2 = new Permission();
      permission2.name = '';
      permission2.codeName = 'foo';
      await permission2.save()
        .then(() => fail('The promise should be rejected.'))
        .catch(err => {
          ok(err instanceof QueryFailedError);
          strictEqual(
            err.message === 'SQLITE_CONSTRAINT: UNIQUE constraint failed: permission.codeName' ||
            err.message === 'SqliteError: UNIQUE constraint failed: permission.codeName' ||
            err.message.startsWith('ER_DUP_ENTRY: Duplicate entry \'foo\' for key ') ||
            err.message.startsWith('duplicate key value violates unique constraint')
            , true);
        });
    });

  });

}

describe('UserWithPermissions', () => {

  testSuite('mysql');
  testSuite('sqlite');
  testSuite('postgres');

});
