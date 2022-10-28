---
title: Custom Express Instance
---

FoalTS allows to provide a custom Express instance to the `createApp` function. In version 1, there were two ways to do it. In version 2, there is only one.

*Version 1*
```typescript
const app = createApp(AppController, expressApp);
// OR
const app = createApp(AppController, {
  expressInstance: expressApp
});
```

*Version 2*
```typescript
const app = await createApp(AppController, {
  expressInstance: expressApp
});
```