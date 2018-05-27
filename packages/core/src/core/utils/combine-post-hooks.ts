import { PostContext } from '../contexts';
import { PostHook } from '../interfaces';
import { ServiceManager } from '../service-manager';

export function combinePostHooks(postHooks: PostHook[]): PostHook {
  return async (ctx: PostContext, services: ServiceManager) => {
    for (const postHook of postHooks) {
      await postHook(ctx, services);
    }
  };
}
