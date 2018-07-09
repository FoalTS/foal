# 4. Create the REST API endpoint

Alright, the next step is to take care of the requests that list, create and delete flights. You could directly use *handlers* for that but this would be tedious work. You would have to add the different routes, call the methods of the model, create the appropriate `HttpResponse` dependending on the status or handle errors when the object is not found.

That's why FoalTS provides a handy function `rest` to quickly build REST endpoints. This kind of function is called a *controller factory*. The `rest` factory takes any *service* that implements the `IModelService` interface and uses it to create the API.

In FoalTS, a *service* can be any class that serves a restricted and well-defined purpose. Services behave independently of the http process and are instantiated as singleton by the framework. They are usually the best place to put the business logic.

That's a lot of concepts to take in. Let's translate it into the code.

Go to `src/app/services` with your terminal/console, run `foal generate service flight` and choose `Model service (TypeORM)`.

Open the new created `flight.service.ts` file and specify the model.

```typescript
import { ModelService, Service } from '@foal/core';

import { Flight } from '../models/flight.model';

@Service()
export class FlightService extends ModelService<Flight> {
  Model = Flight;
}

```

The abstract class `ModelService` implements the `IModelService` methods based on the provided model.

Once done, you need to create and register your REST controller from this new service. Open `src/app/app.module.ts` and replace it with:

```typescript
import { Module, rest } from '@foal/core';

import { getAirport } from './handlers/get-airport';
import { FlightService } from './services/flight.service';

export const AppModule: Module = {
  controllers: [
    route('GET', '/airport', getAirport),
    rest('/flights', FlightService),
  ],
};

```

That's it! We now have a REST API working at the endpoint `/flights`. Go back to your browser, refresh the page and play with your board!

Now take a time and look at your code. You ended setting up a REST API with just a few lines! No need to reinvent the wheel every time!