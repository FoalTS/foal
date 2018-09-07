// 3p
import { getCommandLineArguments, Group, Permission, validate, ValidationError } from '@foal/core';
import { createConnection, getManager, getRepository } from 'typeorm';

const argSchema = {
  additionalProperties: false,
  properties: {
    codeName: { type: 'string', maxLength: 100 },
    name: { type: 'string', maxLength: 80 },
    permissions: { type: 'array', items: { type: 'string' }, uniqueItems: true }
  },
  required: [ 'name', 'codeName' ],
  type: 'object',
};

export async function main(argv) {
  const args = getCommandLineArguments(argv);

  try {
    validate(argSchema, args);
  } catch (error) {
    if (error instanceof ValidationError) {
      error.content.forEach(err => {
        console.log(`The command line arguments ${err.message}`);
      });
      return;
    }
    throw error;
  }

  args.permissions = args.permissions || [];

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
