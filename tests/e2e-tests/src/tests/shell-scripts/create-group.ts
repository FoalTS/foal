// 3p
import { Group, Permission } from '@foal/typeorm';
import { createAndInitializeDataSource } from '../../common';
import { Logger, ServiceManager } from '@foal/core';

export const schema = {
  additionalProperties: false,
  properties: {
    codeName: { type: 'string', maxLength: 100 },
    name: { type: 'string', maxLength: 80 },
    permissions: { type: 'array', items: { type: 'string' }, uniqueItems: true, default: [] }
  },
  required: ['name', 'codeName'],
  type: 'object',
};

export async function main(args: { codeName: string, name: string, permissions: string[] }, services: ServiceManager, logger: Logger) {
  const group = new Group();
  group.permissions = [];
  group.codeName = args.codeName;
  group.name = args.name;

  const dataSource = await createAndInitializeDataSource([Permission, Group], { dropSchema: false });

  try {
    for (const codeName of args.permissions) {
      const permission = await Permission.findOneBy({ codeName });
      if (!permission) {
        throw new Error(`No permission with the code name "${codeName}" was found.`);
      }
      group.permissions.push(permission);
    }

    await group.save();

    logger.info(`Group created: ${group.codeName}`);
  } finally {
    await dataSource.destroy();
  }
}
