import { Class, createApp, IAppController, CreateAppOptions } from '@foal/core';

import { createTestDataSource } from './create-test-data-source';

export async function createAppAndSetUpDabaseConnection(
  appControllerClass: Class<IAppController>,
  entities: Class[],
  options?: CreateAppOptions
): Promise<{ app: any, closeDatabaseConnection: () => Promise<void> }> {
  const dataSource = createTestDataSource(entities);
  await dataSource.initialize();

  const app = await createApp(appControllerClass, options);

  const closeDatabaseConnection = () => dataSource.destroy();

  return { app, closeDatabaseConnection };
}