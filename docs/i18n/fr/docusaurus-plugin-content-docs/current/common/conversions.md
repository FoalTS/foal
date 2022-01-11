---
title: Conversions
---

This page lists common functions to convert one type or format to another.

## Base64 to Base64URL

This function converts a base64-encoded string into a base64URL-encoded string. 

It replaces the characters `+` and `/` with `-` and `_` and omits the `=` sign.

```typescript
import { convertBase64ToBase64url } from '@foal/core';

const foo = convertBase64ToBase64url('bar');
```

## Base64URL to Base64

> *This feature is available from version 2.3 onwards.*

This function converts a base64URL-encoded string into a base64-encoded string. 

It replaces the characters `-` and `_` with `+` and `/` and adds the `=` padding character(s) if any.

```typescript
import { convertBase64urlToBase64 } from '@foal/core';

const foo = convertBase64urlToBase64('bar');
```

## Stream to Buffer

> *This feature is available from version 2.3 onwards.*

This function converts a stream of buffers into a concatenated buffer. It returns a promise.

If the stream emits an error, the promise is rejected with the emitted error.

```typescript
import { streamToBuffer } from '@foal/core';

const buffer = await streamToBuffer(stream);
```