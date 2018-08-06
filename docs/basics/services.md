# Services

```sh
foal generate service my-service
> Empty
```

```typescript
import { Service } from '@foal/core';

@Service()
export class MyService {

}
```

Services are one of core concepts of FoalTS. They are used to perform many different tasks such as logging, compute data, fetching and writing data from and to a database, etc.

Basically a service can be any class that serves a restricted and well-defined purpose. You just need to insert the `@Service()` decorator on its top.

## Accessing services ...

### ... from controllers

```typescript
@Service()
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
@Service()
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
@Service()
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
import { Service, ServiceManager } from '@foal/core';

@Service()
class ServiceA {
  name = 'Service A';
}

@Service()
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