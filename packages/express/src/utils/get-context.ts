import { PostContext } from '@foal/core';

export function getContext(req, stateDef: { req: string, state: string }[]): PostContext {
  const context: PostContext = {
    body: req.body,
    getHeader: req.get.bind(req),
    params: req.params,
    query: req.query,
    response: undefined,
    session: req.session,
    state: {},
    user: null,
  };
  stateDef.forEach(e => context.state[e.state] = req[e.req]);
  return context;
}
