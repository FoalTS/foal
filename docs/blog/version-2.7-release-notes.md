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

## New `afterPreMiddlewares` option in `createApp`

It is now possible to run a custom middleware after all internal Express middlewares of the framework.

This can be useful in rare situations, for example when using the [RequestContext helper](https://mikro-orm.io/docs/identity-map/#-requestcontext-helper-for-di-containers) in Mikro-ORM.

```typescript
const app = await createApp({
   afterPreMiddlewares: [
      (req, res, next) => {
         RequestContext.create(orm.em, next);
      }
   ]
})
```

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
