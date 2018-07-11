import { Controller, HttpResponseNoContent, HttpResponseRedirect } from '../../core';

export function logout(path: string,
                       options: { redirect?: string, httpMethod?: 'GET'|'POST' } = {}): Controller<'main'> {
  const controller = new Controller<'main'>(path);
  controller.addRoute('main', options.httpMethod || 'GET', '', async ctx => {
    delete ctx.request.session.authentication;
    if (options.redirect) {
      return new HttpResponseRedirect(options.redirect);
    }
    return new HttpResponseNoContent();
  });
  return controller;
}
