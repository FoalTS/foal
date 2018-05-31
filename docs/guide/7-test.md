# 7. Test

While we created services across this tutorial you may have noticed that other `spec` files have been created as well. These are tests files. By default the generator install `mocha` and `chai` to let you quickly test your components.

Before testing all your those you need to update `task.service.spec.ts` to take into account the new `LoggerService`.

```typescript
import { TaskService } from './task.service';

import { LoggerService } from './logger.service';

describe('TaskService', () => {

  let service: TaskService;
  let connection: ConnectionService;

  it('should instantiate.', () => {
    connection = new ConnectionService();
    service = new TaskService(new LoggerService());
  });
});
```

Now you can run `npm run build` and then `npm run test`.

During developpement you may be interested as well by the `npm run dev:test` command. It works the same way as `npm run dev:app` expect that it is used to execute the tests and not to launch the app.