# 6. Add a logger

```typescript
import { Service } from '@foal/core';

@Service()
class LoggerService {

  public log(kind: 'info'|'string', message: string) {
    console.log(`[${kind}] ${message}`);
  }

}
```

```typescript
import { ObjectType, Service } from '@foal/core';
import { SequelizeService } from '@foal/sequelize';

import { ConnectionService } from './connection.service';

@Service()
export class TaskService extends SequelizeService<any> {
  constructor(protected connection: ConnectionService, private logger: LoggerService) {
    super('tasks', {
      // Schema
    }, connection);
  }

  public create(data: any, query: ObjectType) {
    this.logger.log('info', 'Create called with ' + JSON.stringify(data));
    return super.create(data, query)
  }

}

```

> **Note:** TypeScript types
>
> `'info'|'debug'` defines a string type that can only take two values `'info'` or `'debug'`.

> **Note:** Template literals
>
> \``[${kind}] ${message}`\` is called a template literal. It is a syntactic sugar to write `'[' + kind + '] ' + message` in a more readable way.