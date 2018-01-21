# 4. Create the REST API endpoint

Almost there! The last thing we need to create our REST API is to create and register a controller.

Open `src/app/app.module.ts` and replace it with:

```typescript
import { rest } from '@foal/common';
import { FoalModule } from '@foal/core';

import { TaskService } from './task.service';

export const AppModule: FoalModule = {
  controllers: [
    rest.attachService('/tasks', TaskService)
  ],
};

```

That's it! We now have a REST API at the endpoint `/tasks`. Go back to your browser, refresh the page and play with your todo-list!

## What did we just do?

First we imported the controller factory `rest` from the `@foal/common` package. A controller factory creates controllers from services that have a specific interface. For instance, the `rest` factory takes a `PartialCRUDService` and the `view` factory (for rendering templates) takes a `ViewService`.

Once a controller is created, it needs to be registered within a module. Every app starts with a module which in this case is the `AppModule`. That's all you need to know for the moment.

Now take a time and look at your code. You ended setting up a REST API with just a few lines! No need to reinvent the wheel every time!