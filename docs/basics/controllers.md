# Controllers

Controllers are created by `controller factories` and have to be registered within a module.

Each controller factory has an `attachService(path: string, ServiceClass: Type<T>)` method to create the controller from a given service.

The package `@foal/common` provides some common controller factories such as `rest` or `view` along with their respective service interfaces. But you can also create your own factory with the abstract class `ControllerFactory<T>` in `@foal/core`.

Let's a take an example on how to set up a REST API endpoint. To do so, we'll need two things:
- the `Partial<ModelService>` interface which will help us to define the service methods (which can be async functions),
- and the `rest` *controller factory* which will create the controller.

First, we need to create a service that implements the interface:
```typescript
import { ModelService } from '@foal/common';
import { ObjectType, Service } from '@foal/core';

class User {
  name: string;
}

@Service()
class UserService implements Partial<ModelService<User>> {
  private id = 0;
  constructor () {}

  public createOne(data: User): User & { id: string } {
    this.id++;
    return { ...data, id: this.id };
  }
}
```

There are other methods such as `createMany`, `findById`, `findAll`, `findByIdAndUpdate`, `updateMany` or `findOneAndRemove`. We choose to only implement the `createOne` method here which matches the `POST` requests.

Now let's create the controller that handles requests at the endpoint `/users`:
```typescript
import { rest } from '@foal/common';
import { FoalModule } from '@foal/core';

const AppModule: FoalModule = {
  controllers: [ rest.attachService('/users', UserService) ]
}
```

That's it!

The final code looks like this:
```typescript
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { getCallback } from '@foal/express';
import { ModelService, rest } from '@foal/common';
import { Foal, ObjectType, Service } from '@foal/core';

class User {
  name: string;
}

@Service()
class UserService implements Partial<ModelService<User>> {
  private id = 0;
  constructor () {}

  public createOne(data: User): User & { id: string } {
    this.id++;
    return { ...data, id: this.id };
  }
}

const foal = new Foal({
  controllers: [ rest.attachService('/users', UserService) ]
});

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(getCallback(foal));
app.listen(3000, () => console.log('Listening...'));
// POST /users with { "name": "toto" } should return { "name": "toto", "createdAt": "..." };
```

## Notes

Paths are specified directly to the controller factory in the module. So:
- a service can be re-used to serve several endpoints,
- all paths are specified in one place (the module declarations).

Some foal services, such as `SequelizeModelService` in `@foal/sequelize`, already implement the `ModelService` interface. So they can be used directly to create a REST endpoint.

You can throw `HttpError` exceptions in your service methods. Current supported exceptions are: `HttpResponseBadRequest`, `HttpResponseUnauthorized`, `HttpResponseForbidden`, `HttpResponseNotFound`, `HttpResponseMethodNotAllowed`, `HttpResponseConflict`, `HttpResponseInternalServerError`, `HttpResponseNotImplemented`