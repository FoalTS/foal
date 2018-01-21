# 3. Add a `Task` service

Now that the database connection is set up, you can create a `Task` service. This service aims to perform any CRUD operations (Create, Read, Update, Delete) to the `tasks` table.

Run `yo foal:service task` and choose `Sequelize`.

Open the new created `task.service.ts` file. It shoud look like this:

```typescript
import { Service } from '@foal/core';
import { SequelizeService } from '@foal/sequelize';

import { ConnectionService } from './connection.service';

@Service()
export class TaskService extends SequelizeService<any> {
  constructor(protected connection: ConnectionService) {
    super('tasks', {
      // Schema
    }, connection);
  }
}

```

`TaskService` inherits from `SequelizeService`, an abstract class which lets you quickly build a CRUD service from a database table. Such table must have its name specified in the `super` function. The second argument is called a schema and defines the rows and types of the table. The last one is the connection service you created in the previous step. To get more details on how we provided the `ConnectionService` to the class please refer to the section `6. Add a logger` of this guide.

Let's define the schema of our tasks. Import `Sequelize` from `@foal/sequelize` and update the second argument with the given fields:

```typescript
{
  completed: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  text: { type: Sequelize.STRING, allowNull: false, defaultValue: '' }
}
```

> *Note:* You can find more data types [here](http://docs.sequelizejs.com/manual/tutorial/models-definition.html).