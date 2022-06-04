// 3p
import { createConnection, getConnection, getMongoManager } from 'typeorm';

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
  const user = new User();

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
