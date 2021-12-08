---
title: Version 2.7 release notes
author: Loïc Poullain
author_title: Fullstack developer and creator of FoalTS
author_url: https://github.com/LoicPoullain
author_image_url: https://avatars1.githubusercontent.com/u/13604533?v=4
image: blog/twitter-banners/version-2.7-release-notes.png
tags: [release]
---

![Banner](./assets/version-2.7-is-here/banner.png)

Version 2.7 of Foal has been released! Here are the improvements that it brings.

<!--truncate-->

## `foal generate entity` and `foal generate hook` support sub-directories

### Example with entities (models)

```shell
foal g entity user
foal g entity business/product
```

*Output*
```
src/
 '- app/
  '- entities/
   |- business/
   | |- product.entity.ts
   | '- index.ts
   |- user.entity.ts
   '- index.ts
```

### Example with hooks

```shell
foal g hook log
foal g hook auth/admin-required
```

*Output*
```
src/
 '- app/
  '- hooks/
   |- auth/
   | |- admin-required.hook.ts
   | '- index.ts
   |- log.hook.ts
   '- index.ts
```

## Environment name can be provided via `NODE_ENV` or `FOAL_ENV`

Version 2.7 allows to you to specify the environment name (production, development, etc) with the `FOAL_ENV` environment variable.

This can be useful if you have third party libraries whose behavior also depends on the value of `NODE_ENV` (see [Github issue here](https://github.com/FoalTS/foal/issues/1004)).