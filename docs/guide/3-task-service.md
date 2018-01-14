# 3. Add a `Task` service

Now that the database connection is set up, we can create a `Task` service. This service aims to perform any CRUD operations (Create, Read, Update, Delete) to the `tasks` table.

Run `yo foal:service task` and choose `Sequelize`.

Open the new created `task.service.ts` file:

```typescript
import { Service } from '@foal/core';
import { SequelizeService } from '@foal/sequelize';

import { MySequelizeConnection } from 'somewhere';

@Service()
export class TaskService extends SequelizeService<any> {
  constructor(protected connection: MySequelizeConnection) {
    super('tasks', {
      // Schema
    }, connection);
  }
}

```

... is called `dependency injection` ...