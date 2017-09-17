import { basic, ModuleData } from '@foal/core';

import { TotoController } from './toto.controller';

export const Module1Module: ModuleData = {
  controllerBindings: [
    basic.bindController('/totos', TotoController)
  ],
  services: [ TotoController ]
};
