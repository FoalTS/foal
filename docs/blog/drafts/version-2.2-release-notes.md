---
title: Version 2.2 release notes
author: Loïc Poullain
author_title: Fullstack developper and creator of Foal TS
author_url: https://github.com/LoicPoullain
author_image_url: https://avatars1.githubusercontent.com/u/13604533?v=4
tags: [release]
---

![Banner](./assets/version-2.2-is-here/banner.png)

Version 2.2 has been released! Here are the improvements that it brings.

<!--truncate-->

## New Look of the `createapp` Command

The output of the `createapp` command has been prettified to be more "welcoming".

![New createapp look](./assets/version-2.2-is-here/new-create-app.png)

## Support of nested routes in `foal generate|g rest-api <name>`

Like the command `g controller`, `g rest-api` now supports nested routes.

Let's say we have the following file structure:

```
src/
 '- app/
  |- controllers/
  | |- api.controller.ts
  | '- index.ts
  '- entities/
    |- user.entity.ts
    '- index.ts
```

Running these commands will add and register the following files:

```
foal generate rest-api api/product --auth --register
foal generate rest-api api/order --auth --register
```

```
src/
 '- app/
  |- controllers/
  | |- api/
  | | |- product.controller.ts
  | | |- order.controller.ts
  | | '- index.ts
  | |- api.controller.ts
  | '- index.ts
  '- entities/
    |- product.entity.ts
    |- order.entity.ts
    |- user.entity.ts
    '- index.ts
```