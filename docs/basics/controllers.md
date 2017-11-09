# Controllers

Controllers are a sub-category of services. They aim to be used for request handling but they can also perform other tasks since they remain services.

So we'll say that a controller is called *as a service* when it has nothing to do with request handling and *as a controller* otherwise.

Let's a take an example on how to set up a REST API endpoint. To do so, we'll need two things:
- the `RestController` interface which will help us to define the controller methods,
- and the `rest` *controller binder* which will bind the controller to the request handler through a module.

First, we need to create a service that implements the interface:
```ts
@Service()
class User implements RestController {
  constructor () {}

  async create(data: any, params: RestParams): Promise<any> {
    data.createdAt = Date.now();
    return data;
  }
}
```

There are other methods such as `update`, `delete`, `modify`, `get` or `getAll`. We choose to only implement the `create` method here which matches the `POST` requests.

Now let's wire it to the request handler at the endpoint `/users`:
```ts
import { rest } from '@foal/core';

const AppModule: FoalModule = {
  services: [ User ],
  controllerBindings: [ rest.bindController('/users', User) ]
}
```

That's it!

The final code looks like this:
```ts
// RestController
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { getCallback } from '@foal/express';
import { Foal, Service, rest, RestController, RestParams } from '@foal/core';

@Service()
class User implements RestController {
  constructor () {}

  async create(data: any, params: RestParams): Promise<any> {
    data.createdAt = Date.now();
    return data;
  }
}

const foal = new Foal({
  services: [ User ],
  controllerBindings: [ rest.bindController('/users', User) ]
});

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(getCallback(foal));
app.listen(3000, () => console.log('Listening...'));
// POST /users with { "name": "toto" } should return { "name": "toto", "createdAt": "..." };
```

## Notes

Paths are specified directly by the binder in the module. So:
- a controller can be re-used to serve several endpoints,
- all paths are specified in one place (the module declarations).

Some foal services, such as `SequelizeService` in `@foal/sequelize`, already implement the `RestController` interface. So they can be used directly as a controller.

You can throw `HttpError` exceptions in your controller methods. Current supported exceptions are: `BadRequestError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `MethodNotAllowedError`, `ConflictError`, `InternalServerError`, `NotImplementedError`