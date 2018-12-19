# Services

```sh
foal generate service my-service
```

```typescript
export class MyService {

}
```

## Description

Services are useful to organize your code in domains. They can be used in a wide variety of situations: logging, interaction with a database, calculations, communication with an external API, etc.

## Architecture

Basically, a service can be any class with a narrow and well defined purpose. They are instantiated as singletons.

## Use & Dependency Injection

You can access a service from a controller using the `@dependency` decorator.

*Example:*
```typescript
import { dependency, Get, HttpResponseOK } from '@foal/core';

class AppController {
  @dependency
  logger: Logger

  @Get('/')
  index() {
    this.logger.log('index has been called!');
    return new HttpResponseOK('Hello world!');
  }

}

class Logger {
  log(message: string) {
    console.log(`${new Date()} - ${message}`);
  }
}
```

> When instantiating the controller, FoalTS will provide the service instance. This mechanism is called *dependency injection* and is particularly interesting in unit testing (see section below).

In the same way, you can access a service from another service.

*Example:*
```typescript
import { dependency } from '@foal/core';

class MyService {
  run() {
    console.log('hello world');
  }
}

class MyServiceA {
  @dependency
  myService: MyService;

  foo() {
    this.myService.run();
  }
}
```

## Testing services

Services are classes and so can be tested as is.

*Example:*
```typescript
// calculator.service.ts
export class CalculatorService {
  sum(a: number, b: number): number {
    return a + b;
  }
}
```

```typescript
// calculator.service.spec.ts
import { strictEqual } from 'assert';
import { CalculatorService } from './calculator.service';

it('CalculatorService', () => {
  const service = new CalculatorService();
  strictEqual(service.sum(1, 2), 3);
});
```

### Services (or Controllers) with Dependencies

If your service has dependencies, you can use the `createService` function to instantiate the service with them.

*Example:*
```typescript
// weather.service.ts
import { dependency } from '@foal/core';

class ConversionService {
  celsiusToFahrenheit(temperature: number): number {
    return temperature * 9/5 + 32;
  }
}

class WeatherService {
  temp = 14;

  @dependency
  conversion: ConversionService

  getWeather(): string {
    const temp = this.conversion.celsiusToFahrenheit(this.temp);
    return `The outside temperature is ${temp} °F.`;
  }
}
```

```typescript
// weather.service.spec.ts
import { strictEqual } from 'assert';
import { createService } from '@foal/core';
import { WeatherService } from './weather.service';

it('WeatherService', () => {
  const service = createService(WeatherService);

  const expected = 'The outside temperature is 57.2 °F.';
  const actual = service.getWeather();

  strictEqual(actual, expected);
});
```

> A similar function exists to instantiate controllers with their dependencies: `createController`.

In many situations, it is necessary to mock the dependencies to truly write *unit* tests. This can be done by passing a second argument to `createService` (or `createController`).

*Example:*
```typescript
// detector.service.ts
import { dependency } from '@foal/core';

class TwitterService {
  fetchLastTweets() {
    // Make a call to the Twitter API to get the last tweets.
  }
}

class DetectorService {
  @dependency
  twitter: Twitter;

  isFoalTSMentionedInTheLastTweets() {
    const tweets = this.twitter.fetchLastTweets();
    if (tweets.find(tweet => tweet.msg.includes('FoalTS'))) {
      return true;
    }
    return false;
  }
}
```

```typescript
// detector.service.spec.ts
import { strictEqual } from 'assert';
import { createService } from '@foal/core';
import { DetectorService } from './weather.service';

it('DetectorService', () => {
  const twitterMock = {
    fetchLastTweets() {
      return [
        { message: 'Hello world!' },
        { message: 'I LOVE FoalTS' },
      ]
    }
  }
  const service = createService(DetectorService, {
    twitter: twitterMock
  });

  const actual = service.isFoalTSMentionedInTheLastTweets();

  strictEqual(actual, true);
});
```

## Accessing the `ServiceManager`

In rare situations, you may want to access the `ServiceManager` which is the identity mapper that contains all the service instances.

```typescript
import { dependency, ServiceManager } from '@foal/core';

class MyService {
  foo() {
    return 'foo';
  }
}

class MyController {
  @dependency
  services: ServiceManager;

  bar() {
    return this.services.get(MyService).foo();
  }
}
```