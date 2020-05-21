// 3p
import { Config } from '@foal/core';
import { connect, disconnect } from 'mongoose';

export const schema = {
  additionalProperties: false,
  properties: {
    /* To complete */
  },
  required: [ /* To complete */ ],
  type: 'object',
};

export async function main(args: any) {
  const uri = Config.getOrThrow('mongodb.uri', 'string');
  await connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

  try {
    // Do something.

  } catch (error) {
    console.error(error);
  } finally {
    await disconnect();
  }
}
