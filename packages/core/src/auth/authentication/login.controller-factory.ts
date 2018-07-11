import {
  Class,
  Controller,
  HttpResponseBadRequest,
  HttpResponseNoContent,
  HttpResponseRedirect,
  HttpResponseUnauthorized,
} from '../../core';

import { isValidationError } from '../../common';
import { IAuthenticator } from './authenticator.interface';

export function login(path: string, AuthenticatorClass: Class<IAuthenticator<any>>,
                      options: { failureRedirect?: string, successRedirect?: string } = {}): Controller<'main'> {
  const controller = new Controller<'main'>(path);
  controller.addRoute('main', 'POST', '', async (ctx, services) => {
    const authenticator = services.get(AuthenticatorClass);
    let credentials;
    try {
      credentials = authenticator.validate(ctx.request.body);
    } catch (err) {
      if (isValidationError(err)) {
        return new HttpResponseBadRequest(err.content);
      }
      throw err;
    }
    const user = await authenticator.authenticate(credentials);

    if (user === null) {
      if (options.failureRedirect) {
        return new HttpResponseRedirect(options.failureRedirect);
      }
      return new HttpResponseUnauthorized({ message: 'Bad credentials.' });
    }

    ctx.request.session.authentication = ctx.request.session.authentication || {};
    ctx.request.session.authentication.userId = user.id || user._id;

    if (options.successRedirect) {
      return new HttpResponseRedirect(options.successRedirect);
    }
    return new HttpResponseNoContent();
  });
  return controller;
}
