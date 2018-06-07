# Utils

FoalTS provides some handy utils to ...

### `combinePostHooks`

### `combinePreHooks`

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