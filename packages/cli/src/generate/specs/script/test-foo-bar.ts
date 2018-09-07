// 3p
import { getCommandLineArguments, validate, ValidationError } from '@foal/core';
import { createConnection } from 'typeorm';

const argSchema = {
  additionalProperties: false,
  properties: {
    /* To complete */
  },
  required: [ /* To complete */ ],
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

  await createConnection();

  // Do something.
}
