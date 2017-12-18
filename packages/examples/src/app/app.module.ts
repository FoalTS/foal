import { afterThatLog, FoalModule, log, rest } from '@foal/core';

import { ConnectionService, UserService } from './services';

export const AppModule: FoalModule = {
  controllerBindings: [
    rest.bindController('/users', UserService),
  ],
  hooks: [
    log('AppModule1'),
    log('AppModule2'),
    afterThatLog('AppModule1 (post)'),
    afterThatLog('AppModule2 (post)'),
  ],
  services: [ ConnectionService, UserService ],
};
