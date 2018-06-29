# 6. Add a logger

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

import { ModelService, Service } from '@foal/core';

import { Flight } from '../models/flight.model';

@Service()
export class FlightService extends ModelService<Flight> {
  Model = Flight;

  constructor(private logger: LoggerService) {}

  createOne(record: Partial<Flight>): Promise<Flight> {
    this.logger.log('info', 'Adding a flight: ' + JSON.stringify(data));
    return super.createOne(data);
  }

}

```

Create a new flight in the browser and then take a look at the terminal from where you launched the app. New logs should appear.

By writting `private logger: LoggerService` we injected the logger service in the flight one. You don't need to instantiate the logger yourself, `FoalTS` takes care of it.

You can do the same with your handler:

```typescript
import { Handler, HttpResponseOK } from '@foal/core';

import { LoggerService } from '../services/logger.service';

export const getAirport: Handler = (ctx, services) => {
  services.get(LoggerService).log('info', 'Getting the aiport name...');
  // Returns { name: 'JFK' } with status 200
  return new HttpResponseOK({ name: 'JFK' });
};
```
