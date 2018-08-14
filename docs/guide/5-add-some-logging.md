# 5. Add some logging

Now that the application is serving properly our REST API, we'd like to add some custom logging.

## The `Log` hook

For that you are going to use the `Log` hook. Hooks are decorators that aim to perform actions before the execution of the controller methods. They can serve many purposes, they are especially useful to control user access or to validate the format of the request data.

Hooks can decorate a controller method, the controller itself or a module. A hook decorating a controller applies to all the controller methods and a hook decorating a module applies to all its controllers and sub-modules.

Let's see how it works.

We'd like to print a custom message when `GET /airport` or one of the REST API endpoints is called.

```typescript
import { Controller, Get, HttpResponseOK, Log } from '@foal/core';

@Controller()
export class AirportController {
  @Get()
  @Log('Someone reads to the airport name.')
  getAirport() {
    // Returns { name: 'JFK' } with status 200
    return new HttpResponseOK({ name: 'JFK' });
  }
}
```

```typescript
import { Controller, Log, RestController } from '@foal/core';

import { FlightCollection } from '../services/flight-collection.service';

@Controller()
@Log('Someone creates, reads, updates or deletes flight(s).')
export class FlightController extends RestController {
  collectionClass = FlightCollection;
}
```

Go to your browser and add a new flight. You should see new logs appear in your terminal/console.

## Creating a custom hook

Great, you added some logging. Now you are going to go further and print the data that you received in the request.

This cannot be done with the basic `Log` hook. That's why you're going to create one of your own.

```shell
foal g hook log-request-data
```

Open the generated file `src/app/hooks/log-request-data.hook.ts`.

```typescript
import { Hook } from '@foal/core';

export function LogRequestData() {
  return Hook(async (ctx, services) => {

  });
}
```

As you can see, to create a hook, you need to provide a hook function. (which may be synchronous or asynchronous). It takes two parameters:
- a `Context` object which provides some information on the http request as well as the authenticated user if it exists,
- and the service manager that lets you access the app services within the hook.

In this example you are going to print the request body. Update the file with the following lines.

```typescript
import { Hook } from '@foal/core';

export function LogRequestData(msg: string) {
  return Hook((ctx, services) => {
    console.log(`Msg: ${msg}. Request body: ${JSON.stringify(ctx.request.body)}`);
  });
}
```

Go back to `airport.controller.ts` and `flight.controller.ts` and replace the `Log` hook with `LogRequestData`. Logs that appear in the console should now look different.

You're done, you just ended the get-started guide!
