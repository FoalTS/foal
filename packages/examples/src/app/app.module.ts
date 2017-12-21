import { afterThatLog, log, rest, view } from '@foal/common';
import { FoalModule } from '@foal/core';

import { ConnectionService, IndexViewService, UserService } from './services';

export const AppModule: FoalModule = {
  controllers: [
    view.attachService('/', IndexViewService),
    rest.attachService('/users', UserService),
  ],
  hooks: [
    log('AppModule1'),
    log('AppModule2'),
    afterThatLog('AppModule1 (post)'),
    afterThatLog('AppModule2 (post)'),
  ],
  services: [ ConnectionService, UserService, IndexViewService ],
};
