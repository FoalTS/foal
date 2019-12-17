// 3p
import { createConnection } from 'typeorm';

export const schema = {
  additionalProperties: false,
  properties: {
    /* To complete */
  },
  required: [ /* To complete */ ],
  type: 'object',
};

export async function main(args: any) {
  await createConnection();

  // Do something.
}
