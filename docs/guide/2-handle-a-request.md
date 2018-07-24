# 2. Handle you first request

Now that all is set up, you are going to handle your first request. The frontend expects to get a json object with the name of the airport when making a request to `GET /airport`.

To do so you'll need to create a *controller*. A *controller* is a simple class which methods, that may be synchronous or asynchronous, return an `HttpResponse`. Each method takes two parameters: a `context` which provides information about the request, the session or the authenticated user, and a service manager `services` which gives access to services (we'll come back to this concept later).

Go to the `src/app/controllers` directory and add a new file named `airport.controller.ts`.

```typescript
import { Controller, Get, HttpResponseOK } from '@foal/core';

@Controller()
export class AirportController {
  @Get()
  getAirport() {
    // Returns { name: 'JFK' } with status 200
    return new HttpResponseOK({ name: 'JFK' });
  }
}

```

Once the `getAirport` method is implemented, you'll have to bind the controller to a route. Go to `app.module.ts` and update the following lines.

```typescript
import { controller, IModule, Module } from '@foal/core';

import { AirportController } from './controllers/airport.controller';

@Module()
export class AppModule implements IModule {
  controllers = [
    controller('/airport', AirportController),
  ];
}

```

Every controller needs to be registered into a module. We're using here the `AppModule` which is the entry point of every FoalTS app.

Save the file and refresh the web page. You should now read `Flights from JFK airport` in your header.