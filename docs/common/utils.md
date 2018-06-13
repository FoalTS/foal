# Utils

## `combinePostHooks(postHooks: PostHook[]): PostHook`

Merges several post hooks into one.

## `combinePreHooks(ppreHooks: PreHook[]): PreHook`

Merges several pre hooks into one.

## `escape(str: string): string`

Escapes HTML and returns a new string.

## `escapeProp(object: object, propName: string): void`

Escapes HTML in the given property.

```typescript
escapeProp(myObject, 'foobar')
```
is equivalent to
```typescript
myObject.foobar = escape(myObject.foobar)
```
