// 3p
// import { isCommon } from '@foal/password';
import { createConnection, getConnection, getMongoManager } from 'typeorm';

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
  const user = new User();
  // user.email = args.email;
  // if (await isCommon(args.password)) {
  //   console.log('This password is too common. Please choose another one.');
  //   return;
  // }
  // await user.setPassword(args.password);

  await createConnection();

  try {
    console.log(
      await getMongoManager().save(user)
    );
  } catch (error: any) {
    console.log(error.message);
  } finally {
    await getConnection().close();
  }
}
