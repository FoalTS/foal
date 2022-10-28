---
title: Application Creation
---

Starting from version 2, the `createApp` function returns a promise. Open `src/index.ts` and update the code as follows:

*Version 1*
```typescript
async function main() {
  // ...
  const app = createApp(AppController);
  // ...
}
```

*Version 2*
```typescript
async function main() {
  // ...
  const app = await createApp(AppController);
  // ...
}
```