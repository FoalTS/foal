---
title: Base 64 URL
---

If you need to convert a base64-encoded string to base64URL, you can use the `convertBase64ToBase64url` function for this. It will replace the characters `+` and `/` by `-` and `_` respectively and omit the `=` sign.

```typescript
const foo = convertBase64ToBase64url('bar');
```