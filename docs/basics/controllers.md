# Controllers

Controllers are created by `controller factories` and have to be registered within a module.

Each controller factory has an `attachService(path: string, ServiceClass: Type<T>)` method to create the controller from a given service.

The package `@foal/common` provides some common controller factories such as `rest` or `view` along with their respective service interfaces. But you can also create your own factory with the abstract class `ControllerFactory<T>` in `@foal/core`.

Let's a take an example on how to set up a REST API endpoint. To do so, we'll need two things:
- the `PartialCRUDService` interface which will help us to define the service methods (which can be async functions),
- and the `rest` *controller factory* which will create the controller.

First, we need to create a service that implements the interface:
```typescript
import { PartialCRUDService } from '@foal/common';
import { ObjectType, Service } from '@foal/core';

@Service()
class User implements PartialCRUDService {
  constructor () {}

  public create(data: any, query: ObjectType): any {
    data.createdAt = Date.now();
    return data;
  }
}
```

There are other methods such as `replace`, `delete`, `modify`, `get` or `getAll`. We choose to only implement the `create` method here which matches the `POST` requests.

Now let's create the controller that handles requests at the endpoint `/users`:
```typescript
import { rest } from '@foal/common';
import { FoalModule } from '@foal/core';

const AppModule: FoalModule = {
  controllers: [ rest.attachService('/users', User) ]
}
```

That's it!

The final code looks like this:
```typescript
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { getCallback } from '@foal/express';
import { PartialCRUDService, rest } from '@foal/common';
import { Foal, ObjectType, Service } from '@foal/core';

@Service()
class User implements PartialCRUDService {
  constructor () {}

  public create(data: any, query: ObjectType): any {
    data.createdAt = Date.now();
    return data;
  }
}

const foal = new Foal({
  controllers: [ rest.attachService('/users', User) ]
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

Some foal services, such as `SequelizeService` in `@foal/sequelize`, already implement the `CRUDService` interface. So they can be used directly to create a REST endpoint.

You can throw `HttpError` exceptions in your service methods. Current supported exceptions are: `BadRequestError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `MethodNotAllowedError`, `ConflictError`, `InternalServerError`, `NotImplementedError`