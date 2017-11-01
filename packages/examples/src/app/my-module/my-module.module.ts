import { FoalModule, rest } from '@foal/core';

import { User2 } from './services/user2.controller';

export const MyModule: FoalModule = {
  controllerBindings: [
    rest.bindController('/users2', User2)
  ],
  imports: [],
  services: [ User2 ]
};
