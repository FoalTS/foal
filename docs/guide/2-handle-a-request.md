# 2. Handle your first request

Now that all is set up, you are going to handle your first request. The frontend expects to get a json object with the name of the airport when making a request to `GET /airport`.

To do so you'll need to create a *controller*. A *controller* is a simple class which methods return an `HttpResponse` or a `Promise<HttpResponse>`. Each of them takes a `Context` as parameter which provides information about the request ans the authenticated user.

Create the controller using the FoalTS CLI.

```shell
foal g controller airport
> Empty
```

This commands creates a file `airport.controller.ts` in `src/app/controllers`.

Open this file and add the `getAirport` method.

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

Now that your controller is created you need to bind it to the request handler. Go to `src/app/app.module.ts` and update the following lines.

```typescript
import { controller, Group, IModule, InitDB, Module, Permission } from '@foal/core';

import { AirportController } from './controllers/airport.controller';

import { User } from './entities';

@Module()
@InitDB([ Permission, Group, User ])
export class AppModule implements IModule {
  controllers = [
    controller('/airport', AirportController),
  ];
}

```

The `AppModule` is the entry point of every FoalTS app. 
> A *module* can be seen as a controller group. It registers the controllers and may include sub modules.

Save the file and refresh the web page. You should now read `Flights from JFK airport` in your header. That's great, it means that the app properly serves the `GET /airport` route!