import { App } from '@foal/core';

import { getAppRouter } from './get-app-router';
import { handleErrors } from './handle-errors';
import { notFound } from './not-found';

export function getMiddlewares(app: App, { debugMode }: { debugMode: boolean },
                               stateDef: { req: string, state: string }[] = [],
                               logFn = console.error): any[] {
  return [
    getAppRouter(app, stateDef),
    notFound(),
    handleErrors(debugMode, logFn)
  ];
}
