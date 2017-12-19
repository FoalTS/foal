import { FoalModule, log, rest, view } from '@foal/core';

import { ConnectionService, IndexViewService, UserService } from './services';

export const AppModule: FoalModule = {
  controllerBindings: [
    view.bindController('/', IndexViewService),
    rest.bindController('/users', UserService),
  ],
  preHooks: [
    log('AppModule')
  ],
  services: [ ConnectionService, UserService, IndexViewService ],
};
