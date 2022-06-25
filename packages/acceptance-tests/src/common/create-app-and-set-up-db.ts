import { Class, createApp, IAppController, CreateAppOptions } from '@foal/core';
import { DataSource } from 'typeorm';

import { createTestDataSource } from './create-test-data-source';

export async function createAppAndSetUpDB(
  appControllerClass: Class<IAppController>,
  entities: Class[],
  options?: CreateAppOptions
): Promise<{ app: any, dataSource: DataSource }> {
  const dataSource = createTestDataSource(entities);
  await dataSource.initialize();

  const app = await createApp(appControllerClass, options);

  return { app, dataSource };
}