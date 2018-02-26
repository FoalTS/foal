import {
  Class,
  Controller,
  HttpResponseOK,
  HttpResponseRedirect,
  HttpResponseUnauthorized,
  ServiceControllerFactory,
} from '@foal/core';

import { AuthenticatorService } from './authenticator-service.interface';

export interface Options {
  failureRedirect?: string;
  successRedirect?: string;
}

export class AuthenticationFactory extends ServiceControllerFactory<AuthenticatorService<any>, 'main', Options> {
  public defineController(controller: Controller<'main'>,
                          ServiceClass: Class<AuthenticatorService<any>>,
                          options: Options = {}): void {
    controller.addRoute('main', 'POST', '/', async (ctx, services) => {
      const user = await services.get(ServiceClass).authenticate(ctx.body);

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
      return new HttpResponseOK(user);
    });
  }
}

export const authentication = new AuthenticationFactory();
