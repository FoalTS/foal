import { FoalModule, log, rest } from '@foal/core';

import { ConnectionService, UserService } from './services';

export const AppModule: FoalModule = {
  controllerBindings: [
    rest.bindController('/users', UserService),
  ],
  preHooks: [
    log('AppModule')
  ],
  services: [ ConnectionService, UserService ],
};
