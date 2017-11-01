import { FoalModule, log, rest } from '@foal/core';

import { MyModule } from './my-module/my-module.module';
import { User } from './services/user.controller';

export const AppModule: FoalModule = {
  controllerBindings: [
    rest.bindController('/users', User),
  ],
  imports: [
    { path: '/foo', module: MyModule }
  ],
  preHooks: [
    log('AppModule (1)'),
    log('AppModule (2)')
  ],
  services: [ User ],
};
