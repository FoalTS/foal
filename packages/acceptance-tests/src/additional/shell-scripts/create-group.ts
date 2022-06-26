// 3p
import { Group, Permission } from '@foal/typeorm';
import { createConnection, getConnection, getManager, getRepository } from 'typeorm';

export const schema = {
  additionalProperties: false,
  properties: {
    codeName: { type: 'string', maxLength: 100 },
    name: { type: 'string', maxLength: 80 },
    permissions: { type: 'array', items: { type: 'string' }, uniqueItems: true, default: [] }
  },
  required: [ 'name', 'codeName' ],
  type: 'object',
};

export async function main(args: { codeName: string, name: string, permissions: string[] }) {
  const group = new Group();
  group.permissions = [];
  group.codeName = args.codeName;
  group.name = args.name;

  await createConnection({
    database: './e2e_db.sqlite',
    entities: [ Permission, Group ],
    type: 'better-sqlite3',
  });

  for (const codeName of args.permissions) {
    const permission = await getRepository(Permission).findOneBy({ codeName });
    if (!permission) {
      console.log(`No permission with the code name "${codeName}" was found.`);
      return;
    }
    group.permissions.push(permission);
  }

  try {
    console.log(
      await group.save()
    );
  } catch (error: any) {
    console.log(error.message);
  } finally {
    await getConnection().close();
  }
}
