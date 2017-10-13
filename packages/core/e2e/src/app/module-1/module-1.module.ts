import { basic, FoalModule } from '@foal/core';

import { TotoController } from './toto.controller';

export const Module1Module: FoalModule = {
  controllerBindings: [
    basic.bindController('/totos', TotoController)
  ],
  services: [ TotoController ]
};
