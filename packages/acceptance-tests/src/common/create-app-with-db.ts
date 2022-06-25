import { Class, createApp, IAppController, CreateAppOptions } from '@foal/core';

import { createTestDataSource } from './create-test-data-source';

export type ShutDownApp = () => Promise<void>;

export async function createAppWithDB(
  appControllerClass: Class<IAppController>,
  entities: Class[],
  options?: CreateAppOptions
): Promise<{ app: any, shutDownApp: ShutDownApp }> {
  const dataSource = createTestDataSource(entities);
  await dataSource.initialize();

  const app = await createApp(appControllerClass, options);

  const shutDownApp = () => dataSource.destroy();

  return { app, shutDownApp };
}