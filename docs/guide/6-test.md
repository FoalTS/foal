# 7. Test

While we created services across this tutorial you may have noticed that other `spec` files have been created as well. These are tests files. By default the generator install `mocha` and `chai` to let you quickly test your components.

Before testing all your those you need to update `flight.service.spec.ts` to take into account the new `LoggerService`.

```typescript
import { FlightService } from './flight.service';

import { LoggerService } from './logger.service';

describe('FlightService', () => {

  let service: FlightService;

  it('should instantiate.', () => {
    service = new FlightService(new LoggerService());
  });
});
```

Now you can run `npm run build:test` and then `npm run test`.

During developpement you may be interested as well by the `npm run develop:test` command. It works the same way as `npm run develop` expect that it is used to execute the tests and not to launch the app.

// TODO: explain that hooks are not executed