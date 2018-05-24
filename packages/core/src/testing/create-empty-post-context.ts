import { PostContext } from '../interfaces';

export function createEmptyPostContext(): PostContext {
  return {
    body: undefined,
    getHeader: (field: string) => field,
    params: {},
    query: {},
    response: undefined,
    session: undefined,
    state: {},
    user: null
  };
}
