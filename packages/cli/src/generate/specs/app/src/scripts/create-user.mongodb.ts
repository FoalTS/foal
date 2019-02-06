// 3p
import { Config } from '@foal/core';
// import { isCommon } from '@foal/password';
import { connect } from 'mongoose';

// App
import { User } from '../app/models';

export const schema = {
  additionalProperties: false,
  properties: {
    // email: { type: 'string' },
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

  const uri = Config.get('mongodb', 'uri');

  await connect(uri, { useNewUrlParser: true });

  try {
    console.log(
      await user.save()
    );
  } catch (error) {
    console.log(error.message);
  }
}
