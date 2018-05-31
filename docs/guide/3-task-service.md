# 3. Add a `Task` model service

Now that the database connection is set up, you can create a `Task` model service. This service aims to perform any CRUD operations (Create, Read, Update, Delete) to the `tasks` table.

Run `foal generate service task` and choose `Model service`.

Open the new created `task.service.ts` file. It shoud look like this:

```typescript
import { ModelService, Service } from '@foal/core';

import { Task } from './task.model';

@Service()
export class TaskService extends ModelService<Task> {
  EntityClass = Task;
}

```

`TaskService` inherits from `SequelizeModelService`, an abstract class which lets you quickly build a model service from a database table. Such table must have its name specified in the `super` function. The second argument is called a schema and defines the rows and types of the table. The last one is the connection service you created in the previous step. To get more details on how we provided the `ConnectionService` to the class please refer to the section `6. Add a logger` of this guide.

Let's define the schema of our tasks. Import `Sequelize` from `@foal/sequelize` and update the second argument with the given fields:

```typescript
@Column({ default: false})
completed: boolean;

@Column()
text: string;
```

Add to `initDB`.

> *Note:* You can find more data types [here](http://typeorm.io/#/entities/column-types-for-mysql--mariadb).