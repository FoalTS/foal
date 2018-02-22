import { ControllerFactory, HttpResponseRedirect, Route, HttpResponseUnauthorized } from '@foal/core';

import { AuthenticatorService } from './authenticator-service.interface';

export interface Options {
  failureRedirect?: string;
  successRedirect?: string;
}

export class AuthenticationFactory extends ControllerFactory<AuthenticatorService<any>, Options> {
  public getRoutes(service: AuthenticatorService<any>, options: Options = {}): Route[] {
    return [
      {
        httpMethod: 'POST',
        middleware: async ctx => {
          const user = await service.authenticate(ctx.body);
          if (user === null) {
            if (options.failureRedirect) {
              return new HttpResponseRedirect(options.failureRedirect);
            }
            return new HttpResponseUnauthorized({ message: 'Bad credentials.' });
          }
          ctx.session.authentication = ctx.session.authentication || {};
          ctx.session.authentication.userId = user.id || user._id;

          if (options.successRedirect) {
            return new HttpResponseRedirect(options.successRedirect);
          }
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
