---
title: Protection XSS
---


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
