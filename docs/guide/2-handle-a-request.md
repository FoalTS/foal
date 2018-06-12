# 2. Handle you first request

Now that all is set up, let's handle your first request. The frontend expects to get a json object with the name of the airport when making a request to `GET /airport`.

To do so, you'll need to create a *handler*. A *handler* is a simple function, that may be synchronous or asynchronous, which returns an `HttpResponse`. It takes two parameters: a `context` which provides information about the request, the session or the authenticated user, and a service manager `services` which gives access to services (we'll come back to this concept later).

Go to the `src/app/handlers` directory and add a new file named `get-airport.ts`.

```typescript
import { Handler, HttpResponseOK } from '@foal/core';

export const getAirport: Handler = (ctx, services) => {
  // Returns { name: 'JFK' } with status 200
  return new HttpResponseOK({ name: 'JFK' });
};

```

Once the handler is implemented, you'll have to bind it to a route. Go to `app.module.ts` and update the following lines.

```typescript
import { Module } from '@foal/core';

import { getAirport } from './handlers/get-airport';

export const AppModule: Module = {
  controllers: [
    route('GET', '/airport', getAirport),
  ],
};

```

The `route` function creates a controller from the `getAirport` handler to process requests sent to `GET /airport`. This controller is then registered into a module, the `AppModule`, which the entry point of every FoalTS app.

Save the file and refresh the web page. You should now read `Flights from JFK airport` in your header.