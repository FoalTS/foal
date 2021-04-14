---
title: Generate Tokens
---


In many situations, we need to generate tokens and then verify them (for example in the flow of a password reset). This document shows how to do so with FoalTS.

## Unsigned Tokens (simple case)

The `generateToken` function generates a cryptographically secure random token encoded in base64url (128 bits)

```typescript
import { generateToken } from '@foal/core';

const token = await generateToken();
```

## Signed Tokens

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