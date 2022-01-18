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
  const connection = await createConnection();

  try {
    // Do something.

  } catch (error: any) {
    console.error(error);
  } finally {
    await connection.close();
  }
}
