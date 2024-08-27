// 3p
import { Logger, ServiceManager } from '@foal/core';

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

export async function main(args: any, services: ServiceManager, logger: Logger) {
  await dataSource.initialize();

  try {
    const user = new User();

    await user.save();

    logger.info(`User created: ${user.id}`);
  } finally {
    await dataSource.destroy();
  }
}
