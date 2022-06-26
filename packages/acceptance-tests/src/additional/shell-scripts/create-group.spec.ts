// std
import { strictEqual } from 'assert';

// 3p
import Ajv from 'ajv';

// FoalTS
import { Group, Permission } from '@foal/typeorm';
import { main as createGroup, schema } from './create-group';
import { createTestConnection } from '../../common';

describe('[Shell scripts] create-perm', () => {

  beforeEach(async () => {
    const connection = await createTestConnection([ Permission, Group ]);
    await Permission.save({
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
      ajv.errors!.forEach(err => {
        throw new Error(`Error: The command line arguments ${err.message}.`);
      });
    }

    await createGroup(args);

    const connection = await createTestConnection([ Permission, Group ], { dropSchema: false });

    try {
      const group = await Group.findOneOrFail({
        where: {
          codeName: 'admin',
          name: 'Administrators',
        },
        relations: { permissions: true }
      });
      strictEqual(group.permissions.length, 1);
      strictEqual(group.permissions[0].codeName, 'delete-users');
    } catch (error: any) {
      throw error;
    } finally {
      await connection.close();
    }
  });
});
