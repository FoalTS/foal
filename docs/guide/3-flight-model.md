# 3. Add `Flight` model service

Great! So far you learnt how to process a simple request and return a json object. Now you are going to go a bit further and create a REST API.

First go to `src/app/models` and create a model.

```
yo foal:model flight
```

Open the generated file and replace the content with the following code.

```typescript
import { Column, Entity } from 'typeorm';

@Entity()
export class Flight {

  @Column()
  destination: string;

}
```



This class is a *Service*. Basically a service can be any class that serves a restricted and well-defined purpose. It requires to be surrounded by the `Service` decorator from the `@foal/core` package.

We'll get back later on other ways to use services.

Add to `models: []`.

This service aims to perform any CRUD operations (Create, Read, Update, Delete) to the `tasks` table.

Run `foal generate service task` and choose `Model service`.

Open the new created `task.service.ts` file. It shoud look like this:

```typescript
import { ModelService, Service } from '@foal/core';

import { Flight } from './flight.model';

@Service()
export class FlightService extends ModelService<Flight> {
  EntityClass = Flight;
}

```

`TaskService` inherits from `SequelizeModelService`, an abstract class which lets you quickly build a model service from a database table. Such table must have its name specified in the `super` function. The second argument is called a schema and defines the rows and types of the table. The last one is the connection service you created in the previous step. To get more details on how we provided the `ConnectionService` to the class please refer to the section `6. Add a logger` of this guide.

Let's define the schema of our tasks. Import `Sequelize` from `@foal/sequelize` and update the second argument with the given fields:

> *Note:* You can find more data types [here](http://typeorm.io/#/entities/column-types-for-mysql--mariadb).