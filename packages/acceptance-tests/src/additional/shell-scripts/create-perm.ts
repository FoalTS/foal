// 3p
import { Permission } from '@foal/typeorm';
import { createTestConnection } from '../../common';

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

  const connection = await createTestConnection([ Permission ], { dropSchema: false });

  try {
    console.log(
      await permission.save()
    );
  } catch (error: any) {
    console.log(error.message);
  } finally {
    await connection.close();
  }
}
