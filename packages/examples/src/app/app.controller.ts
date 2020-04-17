import {
  Context, controller, Get, render, Session, TokenRequired
} from '@foal/core';
import { TypeORMStore } from '@foal/typeorm';

import { AuthController, OpenapiController, ProfileController } from './controllers';

export class AppController {

  subControllers = [
    controller('', AuthController),
    controller('/swagger', OpenapiController),
    controller('/profile', ProfileController),
  ];

  @Get('/')
  @TokenRequired({ cookie: true, store: TypeORMStore, redirectTo: '/signin' })
  index(ctx: Context<any, Session>) {
    return render('./templates/index.html', {
      userInfo: JSON.stringify(ctx.session.get('userInfo'))
    });
  }

  @Get('/signin')
  signin() {
    return render('./templates/signin.html');
  }
}
