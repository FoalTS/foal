# Controller factories

Controller factories are functions that create controllers from services or functions. They should be the only way to create them.

## Common controller factories

You'll find in [this page](../common/controller-factories) the common controller factories provided by FoalTS.

## Create a custom controller factory

To create a custom controller factory you need to create a function that returns a `Controller<RouteName extends string>`. Usually this function takes as first parameter a path.

Example:
```typescript
export interface IFoobarService {
  compute(x: number);
}

function myCustomControllerFactory(path: string, Foobar: Class<FoobarService>): Controller<'main'> {
  const controller = new Controller<'main'>(path);

  controller.addRoute('POST', '/compute', (ctx, services) => {
    if (!ctx.request.body || typeof ctx.request.body.x !== 'number') {
      return new HttpResponseBadRequest();
    }
    const x = ctx.request.body.x;
    return new HttpResponseOK(services.get(Foobar).compute(x));
  });

  return controller;
}
```