// 3p
import * as Ajv from 'ajv';
import { createConnection, getConnection, getRepository } from 'typeorm';

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
      type: 'sqlite',
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
      (ajv.errors as Ajv.ErrorObject[]).forEach(err => {
        throw new Error(`Error: The command line arguments ${err.message}.`);
      });
    }

    await createPerm(args);

    await createConnection({
      database: './e2e_db.sqlite',
      entities: [ Permission ],
      type: 'sqlite',
    });

    try {
      await getRepository(Permission).findOneOrFail(args);
    } catch (error) {
      throw error;
    } finally {
      await getConnection().close();
    }
  });
});
