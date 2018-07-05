import {
  HttpResponse,
  PostContext,
  Route,
  ServiceManager
} from '../../core';

export async function getResponse(route: Route, ctx: PostContext,
                                  services: ServiceManager): Promise<HttpResponse> {
  for (const preHook of route.preHooks) {
    const response = await preHook(ctx, services);
    if (response) {
      ctx.response = response;
      break;
    }
  }

  if (!ctx.response) {
    // TODO: Remove as HttpResponse
    ctx.response = await route.handler(ctx, services) as HttpResponse;
  }

  for (const postHook of route.postHooks) {
    await postHook(ctx, services);
  }

  return ctx.response;
}
