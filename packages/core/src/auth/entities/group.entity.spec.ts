// std
import { fail, notStrictEqual, ok, strictEqual } from 'assert';

// 3p
import { createConnection, getConnection, getManager, QueryFailedError } from 'typeorm';

// FoalTS
import { Group } from './group.entity';
import { Permission } from './permission.entity';

describe('Group', () => {

  beforeEach(() => createConnection({
    database: 'test',
    dropSchema: true,
    entities: [Group, Permission],
    password: 'test',
    synchronize: true,
    type: 'mysql',
    username: 'test',
  }));

  afterEach(() => getConnection().close());

  it('should have a generated primary key "id".', async () => {
    const group = new Group();
    group.name = '';
    group.codeName = 'group';
    group.permissions = [];
    await getManager().save(group);
    notStrictEqual(group.id, undefined);
  });

  it('should have a "name" and whose length is 80.', async () => {
    const group = new Group();
    group.codeName = 'group';
    group.permissions = [];
    await getManager().save(group)
      .then(() => fail('This promise should be rejected.'))
      .catch(err => {
        ok(err instanceof QueryFailedError);
        strictEqual(err.message, 'ER_NO_DEFAULT_FOR_FIELD: Field \'name\' doesn\'t have a default value');
      });

    group.name = 'This is a very long long long long long long long long long long long long line1.';

    await getManager().save(group)
      .then(() => fail('This promise should be rejected.'))
      .catch(err => {
        ok(err instanceof QueryFailedError);
        strictEqual(err.message, 'ER_DATA_TOO_LONG: Data too long for column \'name\' at row 1');
      });
  });

  it('should have a "codeName" which is unique and whose length is 100.', async () => {
    const group = new Group();
    group.name = '';

    await getManager().save(group)
      .then(() => fail('The promise should be rejected.'))
      .catch(err => {
        ok(err instanceof QueryFailedError);
        strictEqual(err.message, 'ER_NO_DEFAULT_FOR_FIELD: Field \'codeName\' doesn\'t have a default value');
      });

    group.codeName = 'This is a very long long long long long long line.'
      + 'This is a very long long long long long long line.1';

    await getManager().save(group)
      .then(() => fail('The promise should be rejected.'))
      .catch(err => {
        ok(err instanceof QueryFailedError);
        strictEqual(err.message, 'ER_DATA_TOO_LONG: Data too long for column \'codeName\' at row 1');
      });

    group.codeName = 'foo';
    await getManager().save(group);

    const group2 = new Group();
    group2.name = '';
    group2.codeName = 'foo';
    await getManager().save(group2)
      .then(() => fail('The promise should be rejected.'))
      .catch(err => {
        ok(err instanceof QueryFailedError);
        strictEqual(err.message.startsWith('ER_DUP_ENTRY: Duplicate entry \'foo\' for key '), true);
      });
  });

  it('should have "permissions" which take Permission instances.', async () => {
    const permission = new Permission();
    permission.name = 'permission1';
    permission.codeName = '';
    await getManager().save(permission);

    const group = new Group();
    group.name = 'group1';
    group.codeName = 'group1';
    group.permissions = [
      permission
    ];

    await getManager().save(group);

    const group2 = await getManager().findOne(Group, group.id, { relations: ['permissions'] });
    if (!group2) {
      throw new Error('Group should have been saved.');
    }
    strictEqual(group2.name, 'group1');

    ok(Array.isArray(group2.permissions));
    strictEqual(group2.permissions.length, 1);
    strictEqual(group2.permissions[0].name, 'permission1');
  });

});
