// App
import { Logger, ServiceManager } from '@foal/core';
import { Permission, User } from '../app/entities';
import { dataSource  } from '../db';

export async function main(args: any, services: ServiceManager, logger: Logger) {
  await dataSource.initialize();

  const user = new User();
  user.email = 'john@foalts.org';
  await user.setPassword('password');

  const user2 = new User();
  user2.email = 'mary@foalts.org';
  await user2.setPassword('password2');

  const permission = new Permission();
  permission.name = 'Admin permission';
  permission.codeName = 'admin';

  user.userPermissions = [ permission ];

  await permission.save();
  logger.info(`Permission created: ${permission.codeName}`);

  await user.save();
  logger.info(`User created: ${user.id} ${user.email}`);

  await user2.save();
  logger.info(`User created: ${user2.id} ${user2.email}`);
}
