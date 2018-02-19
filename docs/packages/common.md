# @foal/common

`@foal/common` consists of several hooks, controller factories and services that are generally used in an project.

## Controller factories

### `multipleViews`

`multipleViews.attachService(path: string, service: MultipleViewsService)`

Renders several templates from a `MultipleViewsService`.

```typescript
interface MultipleViewsService {
  names(): string[];
  render(name: string, locals: ObjectType): Promise<string>|string;
}
```

### `rest`

`rest.attachService(path: string, service: Partial<ModelService<IModel>>)`

Creates a REST controller from a `Partial<ModelService<IModel>>`.

```typescript
type SyncOrAsync<T> = T | Promise<T>;

interface ModelService<IModel, ICreatingModel = IModel, IIdAndTimeStamps = { id: string }, IdType = string> {
  // Create
  createOne(data: ICreatingModel): SyncOrAsync<IModel & IIdAndTimeStamps>;
  createMany(records: ICreatingModel[]): SyncOrAsync<(IModel & IIdAndTimeStamps)[]>;

  // Read
  findById(id: IdType): SyncOrAsync<IModel & IIdAndTimeStamps>;
  findOne(query: ObjectType): SyncOrAsync<IModel & IIdAndTimeStamps>;
  findAll(query: ObjectType): SyncOrAsync<(IModel & IIdAndTimeStamps)[]>;

  // Update
  findByIdAndUpdate(id: IdType, data: Partial<IModel & IIdAndTimeStamps>): SyncOrAsync<IModel & IIdAndTimeStamps>;
  findOneAndUpdate(query: ObjectType, data: Partial<IModel & IIdAndTimeStamps>): SyncOrAsync<IModel & IIdAndTimeStamps>;
  updateMany(query: ObjectType, data: Partial<IModel & IIdAndTimeStamps>): SyncOrAsync<void>;

  // Replace
  findByIdAndReplace(id: IdType, data: IModel & Partial<IIdAndTimeStamps>): SyncOrAsync<IModel & IIdAndTimeStamps>;
  findOneAndReplace(query: ObjectType, data: IModel & Partial<IIdAndTimeStamps>):
    SyncOrAsync<IModel & IIdAndTimeStamps>;

  // Delete
  findByIdAndRemove(id: IdType): SyncOrAsync<void>;
  findOneAndRemove(query: ObjectType): SyncOrAsync<void>;
  removeMany(query: ObjectType): SyncOrAsync<void>;
}

```

### `view`

`view.attachService(path: string, service: ViewService)`

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