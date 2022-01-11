// 3p
// import { hashPassword } from '@foal/core';
import { createConnection } from 'typeorm';

// App
import { User } from '../app/entities';

export const schema = {
  additionalProperties: false,
  properties: {
    // email: { type: 'string', format: 'email' },
    // password: { type: 'string' },
  },
  required: [ /* 'email', 'password' */ ],
  type: 'object',
};

export async function main(/*args*/) {
  const connection = await createConnection();

  try {
    const user = new User();
    // user.email = args.email;
    // user.password = await hashPassword(args.password);

    console.log(await user.save());
  } catch (error) {
    console.log(error.message);
  } finally {
    await connection.close();
  }
}
