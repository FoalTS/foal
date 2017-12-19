import { afterThatLog, FoalModule, log, rest, view } from '@foal/core';

import { ConnectionService, IndexViewService, UserService } from './services';

export const AppModule: FoalModule = {
  controllerBindings: [
    view.bindController('/', IndexViewService),
    rest.bindController('/users', UserService),
  ],
  hooks: [
    log('AppModule1'),
    log('AppModule2'),
    afterThatLog('AppModule1 (post)'),
    afterThatLog('AppModule2 (post)'),
  ],
  services: [ ConnectionService, UserService, IndexViewService ],
};
