import { PostContext } from '../interfaces';

export function createEmptyPostContext(): PostContext {
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
