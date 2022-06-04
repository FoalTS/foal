// 3p
import { createConnection } from 'typeorm';

// App
import { User } from '../app/entities';

export const schema = {
  additionalProperties: false,
  properties: {

  },
  required: [

  ],
  type: 'object',
};

export async function main() {
  const connection = await createConnection();

  try {
    const user = new User();

    console.log(await user.save());
  } catch (error: any) {
    console.log(error.message);
  } finally {
    await connection.close();
  }
}
