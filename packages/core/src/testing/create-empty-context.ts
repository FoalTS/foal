import { Context } from '../interfaces';

export function createEmptyContext(): Context {
  return {
    body: undefined,
    getHeader: (field: string) => field,
    params: {},
    query: {},
    session: undefined,
    state: {},
    user: null
  };
}
