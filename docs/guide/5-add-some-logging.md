# 5. Add some logging

## The `Log` hook

Since input data received by the server cannot be trusted, we need to add control and sanitization tools. These are called hooks.

A hook is a small function, synchronous or asynchronous, that aims to be connected to one, several or all the routes of a controller. It takes two parameters:
- the `Context` object which provides some information on the http request as well as the session object and the authenticated user if they exist,
- the service manager that lets access other services within the hook.

If an `HttpResponse` is returned (or rejected) in the hook then the processing of the request is stopped and the server responds with the `statusCode` and optional `content` of the returned object.

> *Note*: A hook may also decorate a module. If so it applies to all the controllers of the module.

Example : `ValidateBody` to validate the format of the request body, `PermissionRequired` or `LoginRequired` to restrict the route access to certain users.

Now that the hooks are defined, it is time to attach them to the regarded routes.
## Creating a custom hook

## Using a logger service

Now that we have an app running, we would like to log some information with a custom logger. Let's add a new service for that to display messages such as `[{date}][info] Adding a flight...`. Create it by tapping in your terminal the command `foal generate service logger` and select the `Empty` type. Open the file and add the below `log` method.

```typescript
import { Service } from '@foal/core';

@Service()
class LoggerService {

  log(kind: 'info'|'debug', message: string) {
    const date = new Date().toISOString();
    console.log(`[${date}][${kind}] ${message}`);
  }

}
```

> **Note:** TypeScript types
>
> `'info'|'debug'` defines a string type that can only take two values `'info'` or `'debug'`.

> **Note:** Template literals
>
> \``[${date}][${kind}] ${message}`\` is called a template literal. It is a syntactic sugar to write `'[' + date + ']' +'[' + kind + '] ' + message` in a more readable way.

Now go back to `flight.service.ts`, import the `LoggerService`, add `private logger: LoggerService` to the constructor and extend the `createOne` method with some logging.

```typescript
import { LoggerService } from './logger.service';

import { EntitySerializer, Service } from '@foal/core';

import { Flight } from '../entities/flight.entity';

@Service()
export class FlightService extends EntitySerializer<Flight> {
  entityClass = Flight;

  constructor(private logger: LoggerService) {}

  createOne(record: Partial<Flight>): Promise<Flight> {
    this.logger.log('info', 'Adding a flight: ' + JSON.stringify(data));
    return super.createOne(data);
  }

}

```

Create a new flight in the browser and then take a look at the terminal from where you launched the app. New logs should appear.

By writting `private logger: LoggerService` we injected the logger service in the flight one. You don't need to instantiate the logger yourself, `FoalTS` takes care of it.

You can do the same with your controller:

```typescript
import { Controller, Get, HttpResponseOK } from '@foal/core';

import { LoggerService } from '../services/logger.service';

@Controller()
export class AirportController {

  constructor(private logger: LoggerService) {}

  @Get()
  get(ctx, services) {
    this.logger.log('info', 'Getting the aiport name...');
    // Returns { name: 'JFK' } with status 200
    return new HttpResponseOK({ name: 'JFK' });
  }
}

```
