// 3p
import { Permission } from '@foal/typeorm';
import { createTestDataSource } from '../../common';

export const schema = {
  additionalProperties: false,
  properties: {
    codeName: { type: 'string', maxLength: 100 },
    name: { type: 'string' },
  },
  required: [ 'name', 'codeName' ],
  type: 'object',
};

export async function main(args: { codeName: string, name: string }) {
  const permission = new Permission();
  permission.codeName = args.codeName;
  permission.name = args.name;

  const dataSource = createTestDataSource([ Permission ]);
  await dataSource.initialize();

  try {
    console.log(
      await permission.save()
    );
  } catch (error: any) {
    console.log(error.message);
  } finally {
    await dataSource.destroy();
  }
}
