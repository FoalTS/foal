# Common post-hooks

## `afterThatLog(message: string, logFn = console.log)`

Logs the message with the given log function (default is console.log).

Example:
```typescript
const AppModule: Module = {
  controllers: [
    route('/', () => {})
      .withPostHook(afterThatLog('Hello world'))
  ]
}
```

## `onSuccessKeepFields<ResourceClass>(fields: (keyof ResourceClass)[])`

Removes the given field from the context response.

Example:
```typescript
const AppModule: Module = {
  controllers: [
    route('/foo', () => {
        return new HttpSuccessResponseOK({
          username: 'foobar',
          password: 'my_crypted_password'
        });
      })
      .withPostHook(onSuccessKeepFields(['username'])),

    route('/bar', () => {
        return new HttpSuccessResponseOK([
          { username: 'foobar', password: 'my_crypted_password' },
          { username: 'barfoo', password: 'my_other_crypted_password' }
        ]);
      })
      .withPostHook(onSuccessKeepFields(['username'])),
  ]
}
```