# 5. Control and sanitize input data

Of course, input data received by the server cannot be trusted. That's why we need to add control and sanitization tools. These are called pre-hooks.

Pre-hooks are TypeScript decorators that can be attached either on a service method, a service class or in the `hooks` array property of a module. They take a small function called middleware which has two paramaters: a `context` object and the service manager `services`.

The `context` includes a set of properties that refer to the request (`context.body`, `context.query`, `context.params`, etc). The `services` parameter lets you access to other services through its `get` method.

Here we are going to sanitize the `text` attribute to prevent XSS attacks. The `escapeHTML` is used for that. The decorator is attached to the service class which means that it will be executed for all the methods of the service. These methods are `create`, `get`, `getAll`, `update`, `replace` and `delete`.They are directly defined by the abstract `SequelizeService` and are used by the controller we defined previously in the module to handle requests.

```typescript
import { escapeHTML } from '@foal/common';
import { Service, preHook } from '@foal/core';
import { SequelizeService } from '@foal/sequelize';

import { ConnectionService } from './connection.service';

@Service()
@preHook(ctx => {
  if (ctx.body && typeof ctx.body.text === 'string') {
    escapeHTML(ctx.body, 'text');
  }
})
export class TaskService extends SequelizeService<any> {
  constructor(protected connection: ConnectionService) {
    super('tasks', {
      completed: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      text: { type: Sequelize.STRING, allowNull: false, defaultValue: '' }
    }, connection);
  }
}
```