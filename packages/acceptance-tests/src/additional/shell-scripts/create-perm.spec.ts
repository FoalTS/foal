// 3p
import Ajv from 'ajv';
import { createConnection, getConnection } from 'typeorm';

// FoalTS
import { Permission } from '@foal/typeorm';
import { main as createPerm, schema } from './create-perm';

describe('[Shell scripts] create-perm', () => {

  beforeEach(async () => {
    const connection = await createConnection({
      database: './e2e_db.sqlite',
      dropSchema: true,
      entities: [ Permission ],
      synchronize: true,
      type: 'better-sqlite3',
    });
    await connection.close();
  });

  it('should work as expected.', async () => {
    // foal run create-perm name="Permission to access the secret" codeName="access-secret"
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

    await createConnection({
      database: './e2e_db.sqlite',
      entities: [ Permission ],
      type: 'better-sqlite3',
    });

    try {
      await Permission.findOneByOrFail(args);
    } catch (error: any) {
      throw error;
    } finally {
      await getConnection().close();
    }
  });
});
