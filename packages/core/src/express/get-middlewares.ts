import { App } from '../core';
import { getAppRouter } from './get-app-router';
import { handleErrors } from './handle-errors';
import { notFound } from './not-found';

export function getMiddlewares(app: App, { debug }: { debug: boolean },
                               stateDef: { req: string, state: string }[] = [],
                               logFn = console.error): any[] {
  return [
    getAppRouter(app, stateDef),
    notFound(),
    handleErrors(debug, logFn)
  ];
}
