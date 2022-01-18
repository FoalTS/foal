// std
import { strictEqual } from 'assert';

// 3p
import * as Ajv from 'ajv';
import { createConnection, getConnection, getRepository } from 'typeorm';

// FoalTS
import { Group, Permission } from '@foal/typeorm';
import { main as createGroup, schema } from './create-group';

describe('[Shell scripts] create-perm', () => {

  beforeEach(async () => {
    const connection = await createConnection({
      database: './e2e_db.sqlite',
      dropSchema: true,
      entities: [ Permission, Group ],
      synchronize: true,
      type: 'better-sqlite3',
    });
    await getRepository(Permission).save({
      codeName: 'delete-users',
      name: 'Permission to delete users',
    });
    await connection.close();
  });

  it('should work as expected.', async () => {
    // foal run create-group name="Administrators" codeName="admin" permissions='[ "delete-users" ]'
    const args = {
      codeName: 'admin',
      name: 'Administrators',
      permissions: [ 'delete-users' ]
    };

    const ajv = new Ajv({ useDefaults: true });
    if (!ajv.validate(schema, args)) {
      (ajv.errors as Ajv.ErrorObject[]).forEach(err => {
        throw new Error(`Error: The command line arguments ${err.message}.`);
      });
    }

    await createGroup(args);

    await createConnection({
      database: './e2e_db.sqlite',
      entities: [ Permission, Group ],
      type: 'better-sqlite3',
    });

    try {
      const group = await getRepository(Group).findOneOrFail({
        codeName: 'admin',
        name: 'Administrators',
      }, { relations: ['permissions'] });
      strictEqual(group.permissions.length, 1);
      strictEqual(group.permissions[0].codeName, 'delete-users');
    } catch (error: any) {
      throw error;
    } finally {
      await getConnection().close();
    }
  });
});
