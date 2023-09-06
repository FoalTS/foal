---
title: Utilities
---

## Random Tokens

In many situations, we need to generate tokens and then verify them. If your tokens are tied to a state (for example, a user ID), you should refer to the [sessions tokens](../authentication/session-tokens.md) page. If not, the token generators below may be useful.

### Unsigned Tokens

The `generateToken` function generates a cryptographically secure random token encoded in base64url (128 bits).

```typescript
import { generateToken } from '@foal/core';

const token = await generateToken();
```

### Signed Tokens

You can also generate a token using a secret. The secret is used to *sign* the token to provide extra security. It must be encoded in base64. You can generate one with the following command:

```
foal createsecret
```

**Generate a signed token**
```typescript
import { generateSignedToken } from '@foal/core';

const token = await generateSignedToken(secret);
```

**Verify and read a signed token**
```typescript
import { verifySignedToken } from '@foal/core';

const signedTokenToVerify = 'xxx.yyy';
const result = await verifySignedToken(signedTokenToVerify, secret);
if (result === false) {
  console.log('incorrect signature');
} else {
  console.log('The token is ', result);
}
```

## String Encoding

### Base64 to Base64URL

This function converts a base64-encoded string into a base64URL-encoded string. 

It replaces the characters `+` and `/` with `-` and `_` and omits the `=` sign.

```typescript
import { convertBase64ToBase64url } from '@foal/core';

const foo = convertBase64ToBase64url('bar');
```

### Base64URL to Base64

This function converts a base64URL-encoded string into a base64-encoded string. 

It replaces the characters `-` and `_` with `+` and `/` and adds the `=` padding character(s) if any.

```typescript
import { convertBase64urlToBase64 } from '@foal/core';

const foo = convertBase64urlToBase64('bar');
```

## Buffers & Streams

### Stream to Buffer

This function converts a stream of buffers into a concatenated buffer. It returns a promise.

If the stream emits an error, the promise is rejected with the emitted error.

```typescript
import { streamToBuffer } from '@foal/core';

const buffer = await streamToBuffer(stream);
```