# 404 Page

Here's a way to implement custom 404 pages.

```typescript
import { createApp } from '@foal/core';

const app = createApp(AppController, {
  postMiddlewares: [
    (req, res, next) => res.json({message: 'my custom 404'})
  ]
});
```
