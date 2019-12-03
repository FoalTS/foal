import { Config, controller, Get, render } from '@foal/core';

import { ApiController } from './controllers';

export class AppController {
  subControllers = [
    controller('/api', ApiController),
  ];

  @Get('/')
  index() {
    return render('templates/index.html', {
      clientID: Config.get('google.clientId')
    });
  }
}
