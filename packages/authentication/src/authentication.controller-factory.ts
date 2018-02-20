import { ControllerFactory, Route } from '@foal/core';

import { AuthenticatorService } from './authenticator-service.interface';

export class AuthenticationFactory extends ControllerFactory<AuthenticatorService<any>> {
  public getRoutes(service: AuthenticatorService<any>): Route[] {
    return [
      {
        httpMethod: 'POST',
        middleware: async ctx => {
          const user = await service.authenticate(ctx.body);
          ctx.session.authentication = ctx.session.authentication || {};
          ctx.session.authentication.userId = user.id || user._id;
          return user;
        },
        path: '/',
        serviceMethodName: 'authenticate',
        successStatus: 200,
      }
    ];
  }
}

export const authentication = new AuthenticationFactory();
