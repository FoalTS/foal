import {
  Controller,
} from '../../classes';
import {
  HttpResponseNoContent,
  HttpResponseRedirect,
  HttpResponseUnauthorized,
} from '../../http';
import {
  Class,
} from '../../interfaces';

import { IAuthenticator } from './authenticator.interface';

export function login(path: string, ServiceClass: Class<IAuthenticator<any>>,
                      options: { failureRedirect?: string, successRedirect?: string } = {}): Controller<'main'> {
  const controller = new Controller<'main'>(path);
  controller.addRoute('main', 'POST', '', async (ctx, services) => {
    const user = await services.get(ServiceClass).authenticate(ctx.request.body);

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
    return new HttpResponseNoContent();
  });
  return controller;
}
