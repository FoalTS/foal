// 3p
import { getMongoManager } from 'typeorm';

// App
import { User } from '../app/entities';
import { dataSource } from '../db';

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

  await dataSource.initialize();

  try {
    console.log(
      await getMongoManager().save(user)
    );
  } catch (error: any) {
    console.log(error.message);
  } finally {
    await dataSource.destroy();
  }
}
