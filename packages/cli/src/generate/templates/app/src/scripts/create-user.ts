// 3p
import { getCommandLineArguments, Group, Permission, validate, ValidationError } from '@foal/core';
import { createConnection, getManager, getRepository } from 'typeorm';

// App
import { User } from '../app/entities';

const argSchema = {
  additionalProperties: false,
  properties: {
    // email: { type: 'string' },
    groups: { type: 'array', items: { type: 'string' }, uniqueItems: true },
    // password: { type: 'string' },
    userPermissions: { type: 'array', items: { type: 'string' }, uniqueItems: true },
  },
  required: [ /* 'email', 'password' */ ],
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

  args.groups = args.groups || [];
  args.userPermissions = args.userPermissions || [];

  const user = new User();
  user.userPermissions = [];
  user.groups = [];
  // user.email = args.email;
  // await user.setPassword(args.password);

  await createConnection();

  for (const codeName of args.userPermissions as string[]) {
    const permission = await getRepository(Permission).findOne({ codeName });
    if (!permission) {
      console.log(`No permission with the code name "${codeName}" was found.`);
      return;
    }
    user.userPermissions.push(permission);
  }

  for (const codeName of args.groups as string[]) {
    const group = await getRepository(Group).findOne({ codeName });
    if (!group) {
      console.log(`No group with the code name "${codeName}" was found.`);
      return;
    }
    user.groups.push(group);
  }

  try {
    console.log(
      await getManager().save(user)
    );
  } catch (error) {
    console.log(error.message);
  }
}
