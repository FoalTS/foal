// 3p
import { isCommon } from '@foal/password';
import { createConnection } from 'typeorm';

// App
import { User } from '../app/entities';

export const schema = {
  additionalProperties: false,
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
  },
  required: [ 'email', 'password' ],
  type: 'object',
};

export async function main(args: { email: string; password: string }) {
  const connection = await createConnection();
  try {
    const user = new User();
    user.email = args.email;

    if (await isCommon(args.password)) {
      console.log('This password is too common. Please choose another one.');
      return;
    }
    await user.setPassword(args.password);

    console.log(
      await connection.manager.save(user)
    );
  } catch (error) {
    console.log(error.message);
  } finally {
    await connection.close();
  }
}