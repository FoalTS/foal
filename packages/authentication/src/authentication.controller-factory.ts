import {
  Class,
  Controller,
  HttpResponseOK,
  HttpResponseRedirect,
  HttpResponseUnauthorized,
  IServiceControllerFactory,
} from '@foal/core';

import { IAuthenticator } from './authenticator.interface';

export interface Options {
  failureRedirect?: string;
  successRedirect?: string;
}

export class AuthenticationFactory implements IServiceControllerFactory {
  public attachService(path: string, ServiceClass: Class<IAuthenticator<any>>, options: Options = {}):
                       { path: string, controller: Controller<'main'> } {
    const controller = new Controller<'main'>();
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
    return { path, controller };
  }
}

export const authentication = new AuthenticationFactory();
