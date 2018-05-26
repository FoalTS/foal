# Services

Services are the core of FoalTS. They are used to perform many different tasks such as logging or fetching and writing data from and to a database.

Basically a service can be any class that serves a restricted and well-defined purpose. You just need to insert the `@Service()` decorator on its top. Once done the service must be provided to a module so that it can be instantiated as a singleton.

```typescript
import { App, Service } from '@foal/core';

@Service()
class ServiceA {
  name = 'Service A';
}

const app = new App({});

const myServiceA = app.services.get(ServiceA);
console.log(myServiceA.name);
```

## Nested services

If you want to call a service from another one, you need to declare it in the constructor as follow.

```typescript
import { App, Service } from '@foal/core';

@Service()
class ServiceA {
  name = 'Service A';
}

@Service()
class ServiceB {
  name = 'Service B';
  constructor(public serviceA: ServiceA) {}
}

const app = new App({});

const myServiceB = app.services.get(ServiceB);
console.log(myServiceB.name);
console.log(myServiceB.serviceA.name);
```

## Testing services

As foal uses the inversion of control principle, a service is very easy to test. We'll use the framework `chai` for this example but feel free to use another one if you prefer.

```sh
npm install --save-dev chai
```

```typescript
import { Service } from '@foal/core';
import { expect } from 'chai';

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
expect(serviceA.name).to.equal('Service A');

const serviceB = new ServiceB(new ServiceA());
expect(serviceB.serviceA.name).to.equal('Service A');

const mock = {} as ServiceA;
const serviceB2 = new ServiceB(mock);
expect(serviceB2.name).to.equal('Service B');
``` 