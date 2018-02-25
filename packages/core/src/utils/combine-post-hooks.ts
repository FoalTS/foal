import { HttpResponse } from '../classes/http-responses';
import { ServiceManager } from '../classes/service-manager';
import { PostContext, PostHook } from '../interfaces';

export function combinePostHooks(postHooks: PostHook[]): PostHook {
  return async (ctx: PostContext, services: ServiceManager) => {
    for (const postHook of postHooks) {
      await postHook(ctx, services);
    }
  };
}
