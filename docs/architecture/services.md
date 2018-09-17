# Services

```sh
foal generate service my-service
> Empty
```

```typescript
export class MyService {

}
```

Services are one of core concepts of FoalTS. They are used to perform many different tasks such as logging, compute data, fetching and writing data from and to a database, etc.

Basically a service can be any class that serves a restricted and well-defined purpose.

## Accessing services ...

### ... from controllers

```typescript
class MyService {
  run() {
    console.log('hello world');
  }
}

@Controller()
class MyController {
  constructor(private myService: MyService) {}
  @Get('/foo')
  foo(ctx) {
    this.myService.run();
  }
}
// OR
@Controller()
class MyController2 {
  constructor(private services: ServiceManager) {}
  @Get('/foo')
  foo(ctx) {
    this.services.get(MyService).run();
  }
}
```

### ... from hooks

```typescript
class MyService {
  run() {
    console.log('hello world');
  }
}

function MyHook() {
  return Hook((ctx, services) => {
    services.get(MyService).run();
  });
}
```

### ... from other services

```typescript
class MyService {
  run() {
    console.log('hello world');
  }
}

@Controller()
class MyServiceA {
  constructor(private myService: MyService) {}

  foo() {
    this.myService.run();
  }
}
// OR
@Controller()
class MyServiceB {
  constructor(private services: ServiceManager) {}

  foo() {
    this.services.get(MyService).run();
  }
}
```

## Testing services

As foal uses the inversion of control principle, a service is very easy to test.

```typescript
// std
import { strictEqual } from 'assert';

// 3p
import { ServiceManager } from '@foal/core';

class ServiceA {
  name = 'Service A';
}

class ServiceB {
  name = 'Service B';
  constructor(public serviceA: ServiceA) {}
}

const serviceA = new ServiceA();
strictEqual(serviceA.name, 'Service A');

const serviceB = new ServiceB(new ServiceA());
strictEqual(serviceB.serviceA.name, 'Service A');

const mock = {} as ServiceA;
const serviceB2 = new ServiceB(mock);
strictEqual(serviceB2.name, 'Service B');

const services = new ServiceManager();
const serviceB3 = services.get(ServiceB);
strictEqual(serviceB3.name, 'Service B');
``` 