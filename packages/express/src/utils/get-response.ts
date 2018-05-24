import {
  HttpResponse,
  PostContext,
  Route,
  ServiceManager
} from '@foal/core';

export async function getResponse(route: Route, ctx: PostContext,
                                  services: ServiceManager): Promise<void | HttpResponse> {
  for (const preHook of route.preHooks.concat(route.handler)) {
    const response = await preHook(ctx, services);
    if (response) {
      ctx.response = response;
      break;
    }
  }

  for (const postHook of route.postHooks) {
    await postHook(ctx, services);
  }

  return ctx.response;
}
