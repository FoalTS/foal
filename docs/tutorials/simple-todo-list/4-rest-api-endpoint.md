# 4. Create the REST API endpoint

Alright, the next step is to take care of the requests that list, create and delete the flights.

You could use directly a simple *controller* as you did before but this would be a tedious work. You would have to add the different routes, call the methods of the model, create the appropriate `HttpResponse` dependending on the status and handle errors when no object is found.

That's why FoalTS provides an abstract `RestController` to quickly build REST endpoints.

Let's create one.

```shell
foal g controller flight
> REST
```

Open the generated file `src/app/controllers/flight.controller.ts`.

```typescript
import { dependency, RestController } from '@foal/core';

import { FlightCollection } from '../services';

export class FlightController extends RestController {
  @dependency
  collection: FlightCollection;
}
```

Every `RestController` requires to set a collection of resources (the `FlightCollection` that we haven't created yet). It is a *service* that helps to create, read, update or delete resources and return representations of them. In this example you will be using an `EntityResourceCollection` which will simply connect to the `Flight` entity. But projects can be more complex and a REST API endpoint may return a representation of several entities joined together.

> In FoalTS, a *service* can be any class that serves a restricted and well-defined purpose. Services are instantiated as singleton by the framework. They behave independently of the http process and are usually the best place to put the business logic.

Let's create this collection.

```shell
foal g service flight
> EntityResourceCollection
```

A new file is generated. Open it and complete the schema definition.

```typescript
import { EntityResourceCollection, middleware, validate } from '@foal/core';

import { Flight } from '../entities';

const schema = {
  additionalProperties: false,
  properties: {
    destination: { type: 'string' }
  },
  required: [ 'destination' ],
  type: 'object',
};

export class FlightCollection extends EntityResourceCollection {
  entityClass = Flight;
  allowedOperations: EntityResourceCollection['allowedOperations'] = [
    'create', 'findById', 'find', 'modifyById', 'updateById', 'deleteById'
  ];

  middlewares = [
    middleware('create|modifyById|updateById', ({ data }) => validate(schema, data))
  ];
}

```

Now you need to register your REST controller. Open `src/app/app.controller.ts` and add the "flight" line:

```typescript
import { Authenticate, controller } from '@foal/core';

import { AirportController, FlightController, ViewController } from './controllers';

import { User } from './entities';

@Authenticate(User)
export class AppController {
  subControllers = [
    controller('/', ViewController),
    controller('/airport', AirportController),
    controller('/flights', FlightController),
  ];
};

```

That's it! We now have a REST API working at the endpoint `/flights`. Go back to your browser, refresh the page and play with your board!

Now take a time and look at your code. You ended setting up a complete REST API with just a few lines! No need to reinvent the wheel every time!
