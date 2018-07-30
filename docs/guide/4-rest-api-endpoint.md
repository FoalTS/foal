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
import { Controller, RestController } from '@foal/core';

import { FlightSerializer } from '../services/flight-serializer.service';

@Controller()
export class FlightController extends RestController {
  serializerClass = FlightSerializer;
}
```

Every `RestController` requires a serializer (the `FlightSerializer` that we haven't created yet). It is a *service* that helps to create, read, update or delete resources and return representations if them. In this example you will be using an `EntitySerializer` which will simply connect to the `Flight` entity. But projects can be more complex and a REST API endpoint may return a representation of several resources joined together.

> In FoalTS, a *service* can be any class that serves a restricted and well-defined purpose. Services are instantiated as singleton by the framework. They behave independently of the http process and are usually the best place to put the business logic.

Let's create this serializer.

```shell
foal g service flight
> Entity Serializer
```

```typescript
import { EntitySerializer, Service } from '@foal/core';

import { Flight } from '../entities/flight.entity';

@Service()
export class FlightSerializer extends EntitySerializer {
  entityClass = Flight;
}

```

Here is your serializer. Now you need to register your REST controller. Open `src/app/app.module.ts` and add the "flight" line:

```typescript
import { controller, Group, IModule, InitDB, Module, Permission } from '@foal/core';

import { AirportController } from './controllers/airport.controller';
import { FlightController } from './controllers/flight.controller';

import { User } from './entities';

@Module()
@InitDB([ Permission, Group, User, Flight ])
export class AppModule implements IModule {
  controllers = [
    controller('/airport', AirportController),
    controller('/flights', FlightController),
  ];
};

```

That's it! We now have a REST API working at the endpoint `/flights`. Go back to your browser, refresh the page and play with your board!

Now take a time and look at your code. You ended setting up a complete REST API with just a few lines! No need to reinvent the wheel every time!