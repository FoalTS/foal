// std
import { strictEqual } from 'assert';

// 3p
import Ajv from 'ajv';

// FoalTS
import { Group, Permission } from '@foal/typeorm';
import { main as createGroup, schema } from './create-group';
import { createAndInitializeDataSource } from '../../common';
import { Logger, ServiceManager } from '@foal/core';

describe('[Shell scripts] create-perm', () => {

  beforeEach(async () => {
    const dataSource = await createAndInitializeDataSource([ Permission, Group ]);
    await Permission.save({
      codeName: 'delete-users',
      name: 'Permission to delete users',
    });
    await dataSource.destroy();
  });

  it('should work as expected.', async () => {
    // npx foal run create-group name="Administrators" codeName="admin" permissions='[ "delete-users" ]'
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

    const services = new ServiceManager();
    const logger = services.get(Logger);

    await createGroup(args, services, logger);

    const dataSource = await createAndInitializeDataSource([ Permission, Group ], { dropSchema: false });

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
      await dataSource.destroy();
    }
  });
});
