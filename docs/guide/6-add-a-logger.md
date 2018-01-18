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

> **Note**
> `kind: 'info'|'debug'`

> **Note**
> Template literals