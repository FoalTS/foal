# Custom Express Instance

FoalTS allows to provide a custom Express instance to the `createApp` function. In version 1, there were two ways to do it. In version 2, there is only one.

*Before*
```typescript
const app = await createApp(AppController, expressApp);
// OR
const app = await createApp(AppController, {
  expressInstance: expressApp
});
```

*After*
```typescript
const app = await createApp(AppController, {
  expressInstance: expressApp
});
```