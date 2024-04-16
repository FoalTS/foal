---
title: Version 4.3 release notes
author: Loïc Poullain
author_title: Creator of FoalTS. Software engineer.
author_url: https://loicpoullain.com
author_image_url: https://avatars1.githubusercontent.com/u/13604533?v=4
image: blog/twitter-banners/version-4.3-release-notes.png
tags: [release]
---

![Banner](./assets/version-4.3-is-here/banner.png)

Version 4.3 of [Foal](https://foalts.org/) is out!

<!--truncate-->

## Better CLI ouput when script arguments are invalid

Previously, when executing `foal run my-script` with invalid arguments, the CLI would only display one error at a time.

For example, with the following schema and arguments, we would only get this error message:

```typescript
export const schema = {
  type: 'object', 
  properties: {
    email: { type: 'string', format: 'email', maxLength: 2 },
    password: { type: 'string' },
    n: { type: 'number', maximum: 10 }
  },
  required: ['password']
};
```

```bash
foal run my-script email=bar n=11
```

```
Error: The command line arguments must match format "email".
```

From version 4.3 onwards, the CLI logs all validation errors and with a more meaningful description.

```
Script error: arguments must have required property 'password'.
Script error: the value of "email" must NOT have more than 2 characters.
Script error: the value of "email" must match format "email".
Script error: the value of "n" must be <= 10.
```

## [Fix] the logger no longer throws an error in development when the client request is interrupted

Using the logger's `dev` format, Foal would occasionally throw the error `TypeError: Cannot read properties of null`.

This would occur when the connection with the client was lost, which happens, for example, when the React client server hotly reloads.

This version fixes this error.