import {
  Context, controller, Get, render, UseSessions
} from '@foal/core';
import { TypeORMStore } from '@foal/typeorm';

import { AuthController, OpenapiController, ProfileController, GraphqlApiController, GraphiQL2Controller } from './controllers';

export class AppController {

  subControllers = [
    controller('', AuthController),
    controller('/swagger', OpenapiController),
    controller('/profile', ProfileController),
    controller('/graphql', GraphqlApiController),
    controller('/graphiql', GraphiQL2Controller)
  ];

  @Get('/')
  @UseSessions({ cookie: true, store: TypeORMStore, redirectTo: '/signin' })
  index(ctx: Context) {
    return render('./templates/index.html', {
      userInfo: JSON.stringify(ctx.session!.get('userInfo'))
    });
  }

  @Get('/signin')
  signin() {
    return render('./templates/signin.html');
  }
}
