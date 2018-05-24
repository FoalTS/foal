import { PostContext, ServiceManager } from '../classes';
import { PostHook } from '../interfaces';

export function combinePostHooks(postHooks: PostHook[]): PostHook {
  return async (ctx: PostContext, services: ServiceManager) => {
    for (const postHook of postHooks) {
      await postHook(ctx, services);
    }
  };
}
