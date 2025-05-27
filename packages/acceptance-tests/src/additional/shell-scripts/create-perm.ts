// 3p
import { Permission } from '@foal/typeorm';
import { createAndInitializeDataSource } from '../../common';
import { Logger, ServiceManager } from '@foal/core';

export const schema = {
  additionalProperties: false,
  properties: {
    codeName: { type: 'string', maxLength: 100 },
    name: { type: 'string' },
  },
  required: [ 'name', 'codeName' ],
  type: 'object',
};

export async function main(args: { codeName: string, name: string }, services: ServiceManager, logger: Logger) {
  const permission = new Permission();
  permission.codeName = args.codeName;
  permission.name = args.name;

  const dataSource = await createAndInitializeDataSource([ Permission ], { dropSchema: false });

  try {
    await permission.save();

    logger.info(`Permission created: ${permission.codeName}`);
  } finally {
    await dataSource.destroy();
  }
}
