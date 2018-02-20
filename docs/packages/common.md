# @foal/common

`@foal/common` consists of several hooks, controller factories and services that are generally used in an project.

## Controller factories

### `multipleViews`

`multipleViews.attachService(path: string, service: MultipleViewsService)`

Renders several templates from a `MultipleViewsService`.

If `ctx.state.locals` is defined it will be used to call `render`. Otherwise the function will be called with an empty object.

```typescript
interface MultipleViewsService {
  names(): string[];
  render(name: string, locals: ObjectType): Promise<string>|string;
}
```

### `rest`

`rest.attachService(path: string, service: Partial<ModelService<IModel>>)`

Creates a REST controller from a `Partial<ModelService<IModel>>`.

```
POST /my_resource -> service.createOne(...)
GET /my_resource -> service.findAll(...)
GET /my_resource/:id -> service.findById(...)
PATCH /my_resource/:id -> service.findByIdAndReplace(...)
PUT /my_resource/:id -> service.findByIdAndUpdate(...)
DELETE /my_resources/:id -> service.findByIdAndRemove(...)
```

You will find more docs on the `ModelService` interface [here](https://github.com/FoalTS/foal/blob/model-usermodel-authentication/packages/common/src/services/model-service.interface.ts)

### `view`

`view.attachService(path: string, service: ViewService)`

If `ctx.state.locals` is defined it will be used to call `render`. Otherwise the function will be called with an empty object.

Renders one template from a `ViewService`.

```typescript
interface ViewService {
  render(locals: ObjectType): Promise<string>|string;
}
```

## Post-hooks

### `afterThatLog(message: string, logFn = console.log)`

Logs the message with the given log function (default is console.log).

Example:
```typescript
@Service()
@afterThatLog('A method has been called!')
class Service {}
```

### `afterThatRemoveField(name: string)`

Removes the given field from the context result. If the context result is an array, it removes the field from each of its items.

Example:
```typescript
@Service()
class UserService {

  @afterThatRemoveField('password')
  public getUser() {
    return { username: 'foobar', password: 'my_crypted_password' };
  }

  @afterThatRemoveField('password')
  public getUsers() {
    return [
      { username: 'foobar', password: 'my_crypted_password' },
      { username: 'barfoo', password: 'my_other_crypted_password' }
    ];
  }
}
```

## Pre-hooks

### `log(message: string, logFn = console.log)`

Logs the message with the given log function (default is console.log).

Example:
```typescript
@Service()
@log('A method has been called!')
class Service {}
```

### `methodNotAllowed()`

Throws a MethodNotAllowedError. The client gets a `405 Method Not Allowed`.

```typescript
@Service()
class OrganizationService {

  @methodNotAllowed()
  public delete(id) {
    // Deletes the org.
  }
}
```

### `restrictAccessToAuthenticated()`

Returns a 401 status if the user is not authenticated.

### `restrictAccessToAdmin()`

Returns a 401 status if the user is not authenticated and a 403 if `ctx.user.isAdmin` is not truthy.

## Services (interfaces)

### `ModelService`

See docs [here](https://github.com/FoalTS/foal/blob/model-usermodel-authentication/packages/common/src/services/model-service.interface.ts).

### `MultipleViewsService`

### `ViewService`

## Utils

### `escape(str: string): string`

Escapes HTML and returns a new string.

### `escapeHTML(object: ObjectType, propName: string): void`

Escapes HTML for the given property.

```typescript
escapeHTML(myObject, 'foobar')
```
is equivalent to
```typescript
myObject.foobar = escape(myObject.foobar)
```