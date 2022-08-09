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
  await dataSource.initialize();

  try {
    const user = new User();

    console.log(await user.save());
  } catch (error: any) {
    console.error(error.message);
  } finally {
    await dataSource.destroy();
  }
}
