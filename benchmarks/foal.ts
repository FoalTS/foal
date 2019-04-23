import { controller, createApp, Get, HttpResponseOK } from '@foal/core';
import { JWTRequired } from '@foal/jwt';

class AppController {
  subControllers = [
    controller('/api', ApiController)
  ];
}

class ApiController {
  @Get('/users')
  @JWTRequired()
  index() {
    return new HttpResponseOK([ { name: 'someone' } ]);
  }
}

const app = createApp(AppController);

app.listen(3000);
