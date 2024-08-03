// 3p
import Ajv from 'ajv';

// FoalTS
import { Permission } from '@foal/typeorm';
import { main as createPerm, schema } from './create-perm';
import { createAndInitializeDataSource } from '../../common';

describe('[Shell scripts] create-perm', () => {

  beforeEach(async () => {
    // Clear database.
    const dataSource = await createAndInitializeDataSource([ Permission ]);
    await dataSource.destroy();
  });

  it('should work as expected.', async () => {
    // npx foal run create-perm name="Permission to access the secret" codeName="access-secret"
    const args = {
      codeName: 'access-secret',
      name: 'Permission to access the secret'
    };

    const ajv = new Ajv({ useDefaults: true });
    if (!ajv.validate(schema, args)) {
      ajv.errors!.forEach(err => {
        throw new Error(`Error: The command line arguments ${err.message}.`);
      });
    }

    await createPerm(args);

    const dataSource = await createAndInitializeDataSource([ Permission ], { dropSchema: false });

    try {
      await Permission.findOneByOrFail(args);
    } catch (error: any) {
      throw error;
    } finally {
      await dataSource.destroy();
    }
  });
});
