# Common controller factories

## Create a controller from a handler

```typescript
// ./handlers/get-user.ts
import { Handler, HttpResponseOK } from '@foal/core';

export const getUser: Handler = (ctx, services) => {
  return new HttpResponseOK({
    name: 'John',
    id: ctx.request.params.id
  });
};

```

```typescript
import { route, Module } from '@foal/core';

import { getUser } from './handlers/get-user';

export const AppModule: Module = {
  controllers: [
    route('GET', '/:id', getUser)
  ]
};
```

## Create a REST controller from a `Partial<IModelService>`


```typescript
// ./services/train.service.ts
import { IModelService, Service } from '@foal/core';

export interface Train {
  id: string
  name: string;
}

@Service()
export class TrainService implements Partial<IModelService> {
  private id = 0;

  createOne(data: Partial<Train>): Train {
    this.id++;
    return { ...data, id: this.id };
  }

  // Other methods are available.
}
```

```typescript
import { Module, rest } from '@foal/core';

import { TrainService } from './services/train.service';

export const AppModule: Module = {
  controllers: [
    rest('/trains', TrainService)
  ]
};
```

```
POST /my_resource -> service.createOne(...)
GET /my_resource -> service.findMany(...)
GET /my_resource/:id -> service.findOne(...)
PATCH /my_resource/:id -> service.updateOne(...)
PUT /my_resource/:id -> service.updateOne(...)
DELETE /my_resources/:id -> service.removeOne(...)
```

## Create an authenticating controller from a Authenticator service

```typescript
import { login, Module } from '@foal/core';

import { MyAuthenticatorService } from './services/my-authenticator.service';

export const AppModule: Module = {
  controllers: [
    login('/auth', MyAuthenticatorService, {
      failureRedirect: '/auth?invalide_credentials=true', // Optional
      successRedirect: '/home' // Optional
    })
  ]
};
```

## Create a view controller

```typescript
import { view, Module } from '@foal/core';

import { MyAuthenticatorService } from './services/my-authenticator.service';

export const AppModule: Module = {
  controllers: [
    view('/foo', '<html><%= content %></html>', { content: '<body></body>' })
  ]
};
```
