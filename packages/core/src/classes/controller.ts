import {
  Handler,
  HttpMethod,
  PostHook,
  PreHook,
  Route
} from '../interfaces';

export class Controller<RouteName extends string> {
  private routes: Map<RouteName, Route> = new Map();

  constructor(private prePath?: string) {}

  public addRoute(name: RouteName, httpMethod: HttpMethod, path: string, handler: Handler): void {
    this.routes.set(name, {
      handler,
      httpMethod,
      path: (this.prePath ? `${this.prePath}${path}` : path).replace(/(\/)+/g, '/'),
      postHooks: [],
      preHooks: [],
    });
  }

  public getRoute(name: RouteName): Route {
    const route = this.routes.get(name);
    if (!route) {
      throw new Error(`No route called ${name} could be found.`);
    }
    return route;
  }

  public addPreHooksAtTheTop(preHooks: PreHook[]): void {
    this.routes.forEach(route => route.preHooks.unshift(...preHooks));
  }

  public addPostHooksAtTheBottom(postHooks: PostHook[]): void {
    this.routes.forEach(route => route.postHooks.push(...postHooks));
  }

  /**
   * Add one pre-hook at the end of the pre-hooks of the given routes.
   * @param preHook Pre-hook to add to the given routes.
   * @param routeNames Routes where to add the pre-hook. If empty, the pre-hook is added
   * to all routes.
   */
  public withPreHook(preHook: PreHook, ...routeNames: RouteName[]): Controller<RouteName> {
    if (routeNames.length === 0) {
      this.routes.forEach(route => route.preHooks.push(preHook));
    } else {
      routeNames.forEach(name => this.getRoute(name).preHooks.push(preHook));
    }
    return this;
  }

  /**
   * Add several pre-hooks at the end of the pre-hooks of the given routes.
   * @param preHooks Pre-hooks to add to the given routes.
   * @param routeNames Routes where to add the pre-hooks. If empty, the pre-hooks are added
   * to all routes.
   */
  public withPreHooks(preHooks: PreHook[], ...routeNames: RouteName[]): Controller<RouteName> {
    if (routeNames.length === 0) {
      this.routes.forEach(route => route.preHooks.push(...preHooks));
    } else {
      routeNames.forEach(name => this.getRoute(name).preHooks.push(...preHooks));
    }
    return this;
  }

  public withPostHook(postHook: PostHook, ...routeNames: RouteName[]): Controller<RouteName> {
    if (routeNames.length === 0) {
      this.routes.forEach(route => route.postHooks.push(postHook));
    } else {
      routeNames.forEach(name => this.getRoute(name).postHooks.push(postHook));
    }
    return this;
  }

  public withPostHooks(postHooks: PostHook[], ...routeNames: RouteName[]): Controller<RouteName> {
    if (routeNames.length === 0) {
      this.routes.forEach(route => route.postHooks.push(...postHooks));
    } else {
      routeNames.forEach(name => this.getRoute(name).postHooks.push(...postHooks));
    }
    return this;
  }

  public addPathAtTheBeginning(path: string) {
    this.routes.forEach(route => route.path = `${path}${route.path}`.replace(/(\/)+/g, '/'));
  }

  public getRoutes(): Route[] {
    return Array.from(this.routes, e => e[1]);
  }

}
