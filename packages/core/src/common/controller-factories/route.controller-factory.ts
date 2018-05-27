import { Controller, Handler, HttpMethod } from '../../core';

export function route(httpMethod: HttpMethod, path: string, handler: Handler): Controller<'main'> {
  const controller = new Controller<'main'>();
  controller.addRoute('main', httpMethod, path, handler);
  return controller;
}
