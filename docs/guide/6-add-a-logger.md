# 6. Add a logger

Now that we have an app running, we would like to log some information with a custom logger. Let's add a new service for that to display messages such as `[info] Creating a user...`. Create it by tapping in your terminal the command `yo foal:service logger` and select the `None` type. Open the file and add the below `log` method.

```typescript
import { Service } from '@foal/core';

@Service()
class LoggerService {

  log(kind: 'info'|'debug', message: string) {
    console.log(`[${kind}] ${message}`);
  }

}
```

> **Note:** TypeScript types
>
> `'info'|'debug'` defines a string type that can only take two values `'info'` or `'debug'`.

> **Note:** Template literals
>
> \``[${kind}] ${message}`\` is called a template literal. It is a syntactic sugar to write `'[' + kind + '] ' + message` in a more readable way.

Now go back to `task.service.ts`, import the `LoggerService`, add `public logger: LoggerService` to the constructor and extend the `createOne` method with some logging.

```typescript
import { LoggerService } from './logger.service';

import { ModelService, Service } from '@foal/core';

import { Task } from './task.model';

@Service()
export class TaskService extends ModelService<Task> {
  EntityClass = Task;

  constructor(private logger: LoggerService) {}

  createOne(record: Partial<Task>): Task {
    this.logger.log('info', 'Create called with ' + JSON.stringify(data));
    return super.create(data)
  }

}

```

Create a new task in the browser and then take a look at the terminal from where you launched the app. New logs should appear.

By writting `private logger: LoggerService` we injected the logger service in the task one. You don't need to instantiate the logger yourself, `FoalTS` takes care of it.