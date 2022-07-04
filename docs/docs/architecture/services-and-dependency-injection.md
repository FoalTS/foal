---
title: Services & Dependency Injection
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


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

class Logger {
  log(message: string) {
    console.log(`${new Date()} - ${message}`);
  }
}

class AppController {
  @dependency
  logger: Logger

  @Get('/')
  index() {
    this.logger.log('index has been called!');
    return new HttpResponseOK('Hello world!');
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

> Dependencies are injected after the instantiation of the controller/service. So they will appear as `undefined` if you try to read them inside a constructor. If you want to access the dependencies when initializing a controller/service, refer to the [`boot` method](./initialization.md).

> Circular dependencies are not supported. In most cases, when two services are dependent on each other, the creation of a third service containing the functionalities required by both services solves the dependency problem.

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
    return temperature * 9 / 5 + 32;
  }
}

class WeatherService {
  temp = 14;

  @dependency
  conversion: ConversionService;

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
  fetchLastTweets(): { msg: string }[] {
    // Make a call to the Twitter API to get the last tweets.
    return [];
  }
}

class DetectorService {
  @dependency
  twitter: TwitterService;

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
        { msg: 'Hello world!' },
        { msg: 'I LOVE FoalTS' },
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

## Injecting other Instances

To manually inject instances into the identity mapper, you can also provide your own `ServiceManager` to the `createApp` function (usually located at `src/index.ts`).

*src/index.ts (example)*
```typescript
import { createApp, ServiceManager } from '@foal/core';
import { DataSource } from 'typeorm';

import { AppController } from './app/app.controller';
import { dataSource } from './db';

async function main() {
  await dataSource.initialize();

  const serviceManager = new ServiceManager();
  serviceManager.set(DataSource, dataSource);

  const app = await createApp(AppController, {
    serviceManager
  });

  // ...
}

// ...
```

> Note: Interfaces cannot be passed to the `set` method.

*src/controllers/api.controller.ts (example)*
```typescript
import { dependency, Get, HttpResponseOK } from '@foal/core';
import { DataSource } from 'typeorm';

import { Product } from '../entities';

class ApiController {

  @dependency
  dataSource: DataSource;

  @Get('/products')
  async readProducts() {
    const products = await this.dataSource.getRepository(Product).find();
    return new HttpResponseOK(products);
  }

}

```

## Abstract Services

If you want to use a different service implementation depending on your environment (production, development, etc.), you can use an abstract service for this.

*logger.service.ts*
```typescript
export abstract class Logger {
  static concreteClassConfigPath = 'logger.driver';
  static concreteClassName = 'ConcreteLogger';

  abstract log(str: string): void;
}
```

> **Warning:** the two properties must be static.

*console-logger.service.ts (concrete service)*
```typescript
export class ConsoleLogger extends Logger {
  log(str: string) {
    console.log(str);
  }
}

export { ConsoleLogger as ConcreteLogger };
```

<Tabs
  defaultValue="yaml"
  values={[
    {label: 'YAML', value: 'yaml'},
    {label: 'JSON', value: 'json'},
    {label: 'JS', value: 'js'},
  ]}
>
<TabItem value="yaml">

```yaml
logger:
  driver: ./app/services/console-logger.service
```

</TabItem>
<TabItem value="json">

```json
{
  "logger": {
    "driver": "./app/services/console-logger.service"
  }
}
```

</TabItem>
<TabItem value="js">

```javascript
module.exports = {
  logger: {
    driver: "./app/services/console-logger.service"
  }
}
```

</TabItem>
</Tabs>

> The configuration value can be a package name or a path relative to the `src/` directory. If it is a path, it **must** start with `./` and **must not** have an extension (`.js`, `.ts`, etc).

*a random service*
```typescript
export class Service {
  @dependency
  logger: Logger;

  // ...
}
```

### Default Concrete Services

An abstract service can have a default concrete service that is used when no configuration value is specified or when the configuration value is `local`.

```typescript
import { join } from 'path';

export abstract class Logger {
  static concreteClassConfigPath = 'logger.driver';
  static concreteClassName = 'ConcreteLogger';
  static defaultConcreteClassPath = join(__dirname, './console-logger.service');

  abstract log(str: string): void;
}
```

## Usage with Interfaces and Generic Classes

Interfaces and generic classes can be injected using strings as IDs. To do this, you will need the `@Dependency` decorator.

*src/services/logger.interface.ts*
```typescript
export interface ILogger {
  log(message: any): void;
}
```

*src/services/logger.service.ts*
```typescript
import { ILogger } from './logger.interface';

export class ConsoleLogger implements ILogger {
  log(message: any): void {
    console.log(message);
  }
}
```

*src/index.ts (example)*
```typescript
import { createApp, ServiceManager } from '@foal/core';

import { AppController } from './app/app.controller';
import { Product } from './app/entities';
import { ConsoleLogger } from './app/services';
import { dataSource } from './db';

async function main() {
  await dataSource.initialize();
  const productRepository = dataSource.getRepository(Product);

  const serviceManager = new ServiceManager()
    .set('product', productRepository)
    .set('logger', new ConsoleLogger());

  const app = await createApp(AppController, {
    serviceManager
  });

  // ...
}

// ...
```

*src/controllers/api.controller.ts (example)*
```typescript
import { Dependency, Get, HttpResponseOK } from '@foal/core';
import { Repository } from 'typeorm';

import { Product } from '../entities';
import { ILogger } from '../services';

export class ApiController {

  @Dependency('product')
  productRepository: Repository<Product>;

  @Dependency('logger')
  logger: ILogger;

  @Get('/products')
  async readProducts() {
    const products = await this.productRepository.find();
    this.logger.log(products);
    return new HttpResponseOK(products);
  }

}

```

## Accessing the `ServiceManager`

In very rare situations, you may want to access the `ServiceManager` which is the identity mapper that contains all the service instances.

```typescript
import { dependency, Get, HttpResponseOK, ServiceManager } from '@foal/core';

class MyService {
  foo() {
    return 'foo';
  }
}

class MyController {
  @dependency
  services: ServiceManager;

  @Get('/bar')
  bar() {
    const msg = this.services.get(MyService).foo();
    return new HttpResponseOK(msg);
  }
}
```
