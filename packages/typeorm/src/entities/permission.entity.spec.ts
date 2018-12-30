// std
import { fail, notStrictEqual, ok, strictEqual } from 'assert';

// 3p
import { createConnection, getConnection, getManager, QueryFailedError } from 'typeorm';

// FoalTS
import { Permission } from './permission.entity';

describe('Permission', () => {

  beforeEach(() => createConnection({
    database: 'test',
    dropSchema: true,
    entities: [Permission],
    password: 'test',
    synchronize: true,
    type: 'mysql',
    username: 'test',
  }));

  afterEach(() => getConnection().close());

  it('should have a generated primary key "id".', async () => {
    const permission = new Permission();
    permission.name = '';
    permission.codeName = '';
    await getManager().save(permission);
    notStrictEqual(permission.id, undefined);
  });

  it('should have a "name".', () => {
    const permission = new Permission();
    permission.codeName = '';
    return getManager().save(permission)
      .then(() => fail('The promise should be rejected.'))
      .catch(err => {
        ok(err instanceof QueryFailedError);
        strictEqual(err.message, 'ER_NO_DEFAULT_FOR_FIELD: Field \'name\' doesn\'t have a default value');
      });
  });

  it('should have a "codeName" which is unique and whose length is 100.', async () => {
    const permission = new Permission();
    permission.name = '';

    await getManager().save(permission)
      .then(() => fail('The promise should be rejected.'))
      .catch(err => {
        ok(err instanceof QueryFailedError);
        strictEqual(err.message, 'ER_NO_DEFAULT_FOR_FIELD: Field \'codeName\' doesn\'t have a default value');
      });

    permission.codeName = 'This is a very long long long long long long line.'
      + 'This is a very long long long long long long line.1';

    await getManager().save(permission)
      .then(() => fail('The promise should be rejected.'))
      .catch(err => {
        ok(err instanceof QueryFailedError);
        strictEqual(err.message, 'ER_DATA_TOO_LONG: Data too long for column \'codeName\' at row 1');
      });

    permission.codeName = 'foo';
    await getManager().save(permission);

    const permission2 = new Permission();
    permission2.name = '';
    permission2.codeName = 'foo';
    await getManager().save(permission2)
      .then(() => fail('The promise should be rejected.'))
      .catch(err => {
        ok(err instanceof QueryFailedError);
        strictEqual(err.message.startsWith('ER_DUP_ENTRY: Duplicate entry \'foo\' for key '), true);
      });
  });

});
