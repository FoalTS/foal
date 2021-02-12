---
title: What's new in version 2 (part 3/4)
author: Loïc Poullain
author_title: Fullstack developper and creator of FoalTS
author_url: https://github.com/LoicPoullain
author_image_url: https://avatars1.githubusercontent.com/u/13604533?v=4
tags: [release]
---

![Banner](./assets/whats-new-in-version-2-part-3/banner.png)

Version 2 of Foal has been released in December 2020 🎉. This series of four articles presents the major new features.

Here is the part 3.

<!--truncate-->

## New JWT utilities

### Accessing config secrets and public/private keys

Starting from version 2, there is a standardized way to provide and retrieve JWT secrets and RSA public/private keys: the functions `getSecretOrPublicKey` and `getSecretOrPrivateKey`.

#### Using secrets

In this example, a base64-encoded secret is provided in the configuration.

*.env*
```
JWT_SECRET="Ak0WcVcGuOoFuZ4oqF1tgqbW6dIAeSacIN6h7qEyJM8="
```


<Tabs
  groupId="config"
  defaultValue="yaml"
  values={[
    {label: 'YAML', value: 'yaml'},
    {label: 'JSON', value: 'json'},
    {label: 'JS', value: 'js'},
  ]}
>
<TabItem value="yaml">

```yaml
settings:
  jwt:
    secret: "env(JWT_SECRET)"
    secretEncoding: base64
```

</TabItem>
<TabItem value="json">

```json
{
  "settings": {
    "jwt": {
      "secret": "env(JWT_SECRET)",
      "secretEncoding": "base64"
    }
  }
}
```

</TabItem>
<TabItem value="js">

```javascript
module.exports = {
  settings: {
    jwt: {
      secret: "env(JWT_SECRET)",
      secretEncoding: "base64"
    }
  }
}
```

</TabItem>
</Tabs>

Both `getSecretOrPublicKey` and `getSecretOrPrivateKey` functions will return the secret.

In the case where a `secretEncoding` value is provided, the functions return a buffer which is the secret decoded with the provided encoding.

#### Using public and private keys

```javascript
const { Env } = require('@foal/core');
const { readFileSync } = require('fs');

module.exports = {
  settings: {
    jwt: {
      privateKey: Env.get('RSA_PRIVATE_KEY') || readFileSync('./id_rsa', 'utf8'),
      publicKey: Env.get('RSA_PUBLIC_KEY') || readFileSync('./id_rsa.pub', 'utf8'),
    }
  }
}
```

In this case, `getSecretOrPublicKey` and `getSecretOrPrivateKey` return the keys from the environment variables `RSA_PUBLIC_KEY` and `RSA_PRIVATE_KEY` if they are defined or from the files `id_rsa` and `id_rsa.pub` if they are not.

### Managing cookies

cookie

setAuthCookie, removeAuthCookie

## Stateless CSRF protection simplified

setAuthCookie, removeAuthCookie