// App
import { appDataSource } from '../app/data-source';
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
  await appDataSource.initialize();

  try {
    const user = new User();
    console.log(await user.save());
  } catch (error: any) {
    console.error(error.message);
  } finally {
    await appDataSource.destroy();
  }
}
