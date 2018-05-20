# @foal/common

`@foal/common` consists of several hooks, controller factories and services that are generally used in an project.

## Controller factories

### `rest`

`rest.attachService(path: string, service: Partial<IModelService<any, any, any, any>>)`

Creates a REST controller from a `Partial<IModelService<IModel>>`.

```
POST /my_resource -> service.createOne(...)
GET /my_resource -> service.findAll(...)
GET /my_resource/:id -> service.findById(...)
PATCH /my_resource/:id -> service.findByIdAndReplace(...)
PUT /my_resource/:id -> service.findByIdAndUpdate(...)
DELETE /my_resources/:id -> service.findByIdAndRemove(...)
```

You will find more docs on the `IModelService` interface [here](https://github.com/FoalTS/foal/blob/model-usermodel-authentication/packages/common/src/services/model-service.interface.ts)

## Post-hooks

### `afterThatLog(message: string, logFn = console.log)`

Logs the message with the given log function (default is console.log).

Example:
```typescript
const AppModule: Module = {
  controllers: [
    route
      .attachHandler('/', () => {})
      .withPostHook(afterThatLog('Hello world'))
  ]
}
```

### `afterThatRemoveField(name: string)`

Removes the given field from the context result. If the context result is an array, it removes the field from each of its items.

Example:
```typescript
const AppModule: Module = {
  controllers: [
    route
      .attachHandler('/foo', () => {
        return new HttpSuccessResponseOK({
          username: 'foobar',
          password: 'my_crypted_password'
        });
      })
      .withPostHook(afterThatRemoveField('password')),
    route
      .attachHandler('/bar', () => {
        return new HttpSuccessResponseOK([
          { username: 'foobar', password: 'my_crypted_password' },
          { username: 'barfoo', password: 'my_other_crypted_password' }
        ]);
      })
      .withPostHook(afterThatRemoveField('password')),
  ]
}
```

## Pre-hooks

### `log(message: string, logFn = console.log)`

Logs the message with the given log function (default is console.log).

Example:
```typescript
const AppModule: Module = {
  controllers: [
    route
      .attachHandler('/', () => {})
      .withPreHook(log('Hello world'))
  ]
}
```

### `methodNotAllowed()`

Returns an HttpResponseMethodNotAllowed..

```typescript
const AppModule: Module = {
  controllers: [
    rest
      .attachService('/', MyModelService)
      .withPreHook(methodNotAllowed(), 'DELETE /:id')
  ]
}
```

## Services (interfaces)

### `IModelService`

See docs [here](https://github.com/FoalTS/foal/blob/model-usermodel-authentication/packages/common/src/services/model-service.interface.ts).

## Utils

### `escape(str: string): string`

Escapes HTML and returns a new string.

### `escapeHTML(object: object, propName: string): void`

Escapes HTML for the given property.

```typescript
escapeHTML(myObject, 'foobar')
```
is equivalent to
```typescript
myObject.foobar = escape(myObject.foobar)
```