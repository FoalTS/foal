# @foal/express

FoalTS needs [Express](http://expressjs.com/) to run. This package aims connect the foal app to an express application.

## `getMiddlewares`

This function returns from a given foal app the express middlewares to include in the express application.

**Params**:
- `app: App` The foal application.
- `{ debug }: { debug: boolean }` If `debug` is true then errors thrown or rejected in the app will be displayed in the browser with their traceback. If it is false then the browser will display a standard 500 INTERNAL SERVER ERROR.
- `stateDef: { req: string, state: string }[] = []` Optional array to forward data from the express `req` object to the foal `context` `state`.
- `logFn = console.error` Log function used to print the traceback of the errors thrown or rejected in the application. 

**Example**
```typescript
const foalApp = new App({
  controllers: []
});

app.use(getMiddlewares(foalApp, { debug: true }));
```