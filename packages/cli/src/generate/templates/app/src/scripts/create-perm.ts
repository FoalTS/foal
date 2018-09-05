// 3p
import { getCommandLineArguments, Permission, validate, ValidationError } from '@foal/core';
import { createConnection, getManager } from 'typeorm';

const argSchema = {
  additionalProperties: false,
  properties: {
    codeName: { type: 'string', maxLength: 100 },
    name: { type: 'string' },
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

  const permission = new Permission();
  permission.codeName = args.codeName;
  permission.name = args.name;

  await createConnection();

  try {
    console.log(
      await getManager().save(permission)
    );
  } catch (error) {
    console.log(error.message);
  }
}
