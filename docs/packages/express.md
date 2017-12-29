# @foal/express

Foal package to run the app with express.

## `getCallback(foal: Foal)`

Returns an express middleware from the foal application. It's an adapter to make foal work with express.

**Note:** Errors are not processed by this middleware. This means that any errors thrown or rejected in the foal app will have to be handled then by an express error-handling middleware. You can use `handleErrors` for that (available in the same package).

**Example**
```typescript
const foalApp = new Foal({
  controllers: []
});

app.use(getCallack(foalApp));
```

## `handleErrors(options: { logErrors?: boolean, sendStack?: boolean } = {}, logFn = console.error)`

Returns an express middleware to handle errors thrown in previous middlewares.

**Options:**
- `logErrors: boolean` - specifies if the errors should be logged. Default: `false`.
- `sendStack: boolean` - specifies if the error stack should be sent in the response. Use it only in development. Default: `false`.
- `logFn` - function used to log the errors. Default: `console.error`.

**Example**
```typescript
const foalApp = new Foal({
  controllers: []
});

app.use(getCallack(foalApp));
app.use(handleErrors({ logErrors: true }));
```