import { Config, IModule, Module, view } from '@foal/core';

import { index } from './templates';

@Module()
export class AppModule implements IModule {
  controllers = [
    view('/', index, ctx => ({
      appName: Config.get('app', 'name'),
      csrfToken: ctx.state.csrfToken,
    }))
  ];

  subModules = [

  ];

  models = [

  ];
}
