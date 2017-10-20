import { FoalModule, log, rest } from '@foal/core';

import { User } from './services/user.controller';
import { User2 } from './services/user2.controller';

export const AppModule: FoalModule = {
  controllerBindings: [
    rest.bindController('/users', User),
    rest.bindController('/users2', User2)
  ],
  preHooks: [
    log('AppModule (1)'),
    log('AppModule (2)')
  ],
  services: [ User, User2 ],
};
