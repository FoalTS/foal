// 3p
import { Group, Permission } from '@foal/typeorm';
import { createConnection, getManager, getRepository } from 'typeorm';

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

export async function main(args) {
  const group = new Group();
  group.permissions = [];
  group.codeName = args.codeName;
  group.name = args.name;

  await createConnection();

  for (const codeName of args.permissions as string[]) {
    const permission = await getRepository(Permission).findOne({ codeName });
    if (!permission) {
      console.log(`No permission with the code name "${codeName}" was found.`);
      return;
    }
    group.permissions.push(permission);
  }

  try {
    console.log(
      await getManager().save(group)
    );
  } catch (error) {
    console.log(error.message);
  }
}
