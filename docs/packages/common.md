# @foal/common

`@foal/common` consists of several hooks, controller factories and services that are generally used in an project.

## Controller factories

### `rest`

`rest(path: string, service: Partial<IModelService>)`

Creates a REST controller from a `Partial<IModelService>`.

```
POST /my_resource -> service.createOne(...)
GET /my_resource -> service.findMany(...)
GET /my_resource/:id -> service.findOne(...)
PATCH /my_resource/:id -> service.updateOne(...)
PUT /my_resource/:id -> service.updateOn(...)
DELETE /my_resources/:id -> service.removeOne(...)
```

## Post-hooks

### `afterThatLog(message: string, logFn = console.log)`

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

### `onSuccessKeepFields<ResourceClass>(fields: (keyof ResourceClass)[])`

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

## Pre-hooks

### `log(message: string, logFn = console.log)`

Logs the message with the given log function (default is console.log).

Example:
```typescript
const AppModule: Module = {
  controllers: [
    route('/', () => {})
      .withPreHook(log('Hello world'))
  ]
}
```

### `methodNotAllowed()`

Returns an HttpResponseMethodNotAllowed..

```typescript
const AppModule: Module = {
  controllers: [
    rest('/', MyModelService)
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

### `escapeProp(object: object, propName: string): void`

Escapes HTML for the given property.

```typescript
escapeProp(myObject, 'foobar')
```
is equivalent to
```typescript
myObject.foobar = escape(myObject.foobar)
```