import { Context } from '../interfaces';

export function createEmptyContext(): any {
  return {
    body: undefined,
    getHeader: (field: string) => field,
    params: {},
    query: {},
    result: undefined,
    session: undefined,
    state: {},
    user: undefined
  };
}
