# Controllers

Controllers are created by *controller factories* and have to be registered within a module.

## Create a controller from an handler function

```typescript
import { route, HttpResponseOK, Module } from '@foal/core';

const AppModule: Module = {
  controllers: [
    route('GET', '/:id', (ctx, services) => {
      return new HttpResponseOK({
        name: 'John',
        id: ctx.request.params.id
      });
    })
  ]
};
```

## Create a REST controller from a Model service

```typescript
import { rest } from '@foal/common';
import { HttpResponseOK, Module } from '@foal/core';

import { MyModelService } from './my-model-service';

const AppModule: Module = {
  controllers: [
    rest('/foo', MyModelService)
  ]
};
```

```typescript
// my-model-service
import { IModelService } from '@foal/common';
import { Service } from '@foal/core';

class User {
  name: string;
}

@Service()
class UserService implements Partial<IModelService<User>> {
  private id = 0;

  createOne(data: User): User & { id: string } {
    this.id++;
    return { ...data, id: this.id };
  }

  // Other methods are available : findById, findAll, findByIdAndRemove, etc.
}
```

## Create a authenticating controller from a Authenticator service

```typescript
import { authentication } from '@foal/password';
import { HttpResponseOK, Module } from '@foal/core';

import { MyAuthenticatorService } from './my-authenticator-service';

const AppModule: Module = {
  controllers: [
    login('/auth', MyAuthenticatorService, {
      failureRedirect: '/auth?invalide_credentials=true', // Optional
      successRedirect: '/home' // Optional
    })
  ]
};
```
