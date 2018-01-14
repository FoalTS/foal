# @foal/express

Foal package to run the app with express.

## `getCallback(foal: Foal)`

Returns an express middleware from the foal application. It's an adapter to make foal work with express.

**Note:** Errors are not processed by this middleware. This means that any errors thrown or rejected in the foal app will have to be handled then by an express error-handling middleware. Express already integrates a default one but you can also use `handleErrors` for a higher flexibility.

**Example**
```typescript
const foalApp = new Foal({
  controllers: []
});

app.use(getCallack(foalApp));
```

## `handleErrors(options: { logs?: 'none'|'500'|'all', sendStack?: boolean } = {}, logFn = console.error)`

Returns an express middleware to handle errors thrown in previous middlewares.

**Options:**
- `logs: 'none'|'500'|'all'` - specifies which errors should be logged (with their traceback). `none` prevents the errors from being logged. `500` logs only internal server errors (such as `Error` or `InternalServerError`). `all` logs all errors (including `NotFoundError`, `BadRequestError`, etc). Default: `none`.
- `sendStack: boolean` - specifies if the error stack should be sent in the response. Use it only in development. Default: `false`.
- `logFn` - function used to log the errors. Default: `console.error`.

**Example**
```typescript
const foalApp = new Foal({
  controllers: []
});

app.use(getCallack(foalApp));
app.use(handleErrors({ logs: '500' }));
```