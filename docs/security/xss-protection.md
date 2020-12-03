# XSS protection

> You are reading the documentation for version 2 of FoalTS. Instructions for upgrading to this version are available [here](../upgrade-to-v2/index.md). The old documentation can be found [here](https://github.com/FoalTS/foal/tree/v1.x/docs).

FoalTS provides some utils to protect you against XSS attacks.

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
