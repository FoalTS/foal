# Services

Services are the core of FoalTS. They are used to perform many different tasks such as handling requests or fetching data from a database.

Basically every class can be a service. You just need to insert the `@Injectable()` decorator on its top. Once done the service must be provided to a module so that it can be instantiated as a singleton.

```ts
import { FoalModule, Injectable } from '@foal/core';

@Injectable()
class ServiceA {
  public name = 'Service A';
  constructor() {}
}

const foal = new FoalModule({
  services: [ ServiceA ]
});

const myServiceA = foal.injector.get(ServiceA);
console.log(myServiceA.name);
```

## Nested services

If you want to call a service from another one, you need to inject it in the constructor as follows.

```ts
import { FoalModule, Injectable } from '@foal/core';

@Injectable()
class ServiceA {
  public name = 'Service A';
  constructor() {}
}

@Injectable()
class ServiceB {
  public name = 'Service B';
  constructor(public serviceA: ServiceA) {}
}

const foal = new FoalModule({
  services: [ ServiceA, ServiceB ]
});

const myServiceB = foal.injector.get(ServiceB);
console.log(myServiceB.name);
console.log(myServiceB.serviceA.name);
```

## Testing services

As foal uses the inversion of control principle, a service is very easy to test. We'll use the framework `chai` for this example but feel free to use another one if you prefer.

```sh
npm install --save-dev chai
```

```ts
import { Injectable } from '@foal/core';
import { expect } from 'chai';

@Injectable()
class ServiceA {
  public name = 'Service A';
  constructor() {}
}

@Injectable()
class ServiceB {
  public name = 'Service B';
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