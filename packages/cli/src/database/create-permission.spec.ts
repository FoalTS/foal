// std
import { strictEqual } from 'assert';

// 3p
import { getConnection, getRepository } from 'typeorm';

// FoalTS
import { createPermission } from './create-permission';
import { Permission } from './entities.spec';

describe('createPermission', () => {

  afterEach(() => getConnection().close());

  it('should create a new permission from the given arguments.', async () => {
    await createPermission('My permission', 'perm', './entities.spec');

    const results = await getRepository(Permission).find();

    strictEqual(results.length, 1);
    strictEqual(results[0].name, 'My permission');
    strictEqual(results[0].codeName, 'perm');
  });

  it('should return the string representation of the new permission.', async () => {
    const actual = await createPermission('My permission', 'perm', './entities.spec');
    const expected =
`{
  "name": "My permission",
  "codeName": "perm",
  "id": 1
}`;
    strictEqual(actual, expected);
  });

  it('should return the string message of any database errors.', async () => {
    await createPermission('My permission', 'perm', './entities.spec');
    const actual = await createPermission('My permission', 'perm', './entities.spec');

    strictEqual(actual, 'the error syntax');
  });

});
