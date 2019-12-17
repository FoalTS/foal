// 3p
import { isCommon } from '@foal/password';
import { createConnection, getConnection, getManager } from 'typeorm';

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

export async function main(args: { email: string, password: string }) {
  await createConnection();

  const user = new User();
  user.email = args.email;

  if (await isCommon(args.password)) {
    console.log('This password is too common. Please choose another one.');
    return;
  }
  await user.setPassword(args.password);

  try {
    console.log(
      await getManager().save(user)
    );
  } catch (error) {
    console.log(error.message);
  }

  await getConnection().close();
}
