# REST API

REST API can be created using a `RestController` and a `ResourceCollection` service. They are not mandatory and you can create your REST API by hand by implementing your own controller. But they can be useful to split the logic and the presentation and to avoid writing boilerplate.

- The `RestController` is in charge of converting http inputs (the request query and params, the body, the cookies or sessions) into organized data that is then sent to the `ResourceCollection` service. In a nutshell, RestController lets you separate the presentation from the business logic. It does not make any assumption on what a user is allowed to do or how the resources are actually created, read, update or deleted into the database(s). It just translates the HTTP request into understanble inputs to the service methods. These inputs describe *what the user wants to do*.

```sh
foal g controller flight
> REST
```

- The `ResourceCollection` service is responsible for implementing the business logic. It creates, reads, updates and deletes resources of a collection and then return representations of them. It checks if the user has the right to do it and if the data he/she sends is correct. Here is the interface of such a service.

```typescript
interface IResourceCollection {
  create(user: AbstractUser|undefined, data: object, params: { fields?: string[] });

  find(user: AbstractUser|undefined, params: { query?: object, fields?: string[] });
  findById(user: AbstractUser|undefined, id, params: { fields?: string[] });

  modifyById(user: AbstractUser|undefined, id, data: object, params: { fields?: string[] });
  updateById(user: AbstractUser|undefined, id, data: object, params: { fields?: string[] });

  deleteById(user: AbstractUser|undefined, id, params: {});
}
```

```sh
foal g service flight
> ResourceCollection
```


> In the future, FoalTS will support websockets and will probably have a special controller that requires a `ResourceCollection`. Implementing a `ResourceCollection` allows you to not have concerns about how the server interacts with the client and to switch easily between HTTP and Websockets.

## The `EntityResourceCollection` service

Sometimes a collection is pretty closed to an entity (a simple model) and it then makes sense to use the `EntityResourceCollection` to avoid writing boilerplate.

```sh
foal g service flight
> EntityResourceCollection
```

```typescript
import { EntityResourceCollection, Service } from '@foal/core';

import { Flight } from '../entities/flight.entity';

@Service()
export class FlightCollection extends EntityResourceCollection {
  entityClass = Flight;
  allowedOperations: EntityResourceCollection['allowedOperations'] = [
    'create', 'findById', 'find', 'modifyById', 'updateById', 'deleteById'
  ];
}

```

The `EntityResourceCollection` already has its methods implemented to create, read, update and delete resources with the provided `entityClass`.

> **Note:** Each method of an `EntityResourceCollection` throws a `PermissionDenied` error by default.
This serves security purpose, it prevents the access to any logic that you might have exposed by accident. To make an operation available you must provide its name to the `allowedOperations` array.

The service also provides `middlewares` to handle authorization, input validation and more.

```typescript
...

const restrictToAdminUsers = (context: { user: AbstractUser|undefined, resource, data, params: CollectionParams }) => {
  const user = context.user;
  if (!user || !user.hasPerm('admin-perm')) {
    throw new PermissionDenied()
  }
}

const validateData = (context: { user: AbstractUser|undefined, resource, data, params: CollectionParams }) => {
  if (typeof context.data.myNum !== 'number') {
    throw new ValidationError({
      message: 'myNum should be a number'
    }),
  }
}

const onlyReturnName = (context: { user: AbstractUser|undefined, resource, data, params: CollectionParams }) => {
  params.fields = [ 'name' ];
}

...
export class FlightCollection extends EntityResourceCollection {
  ...
  middlewares = [
    middleware('*', restrictToAdminUsers),
    middleware('createById', validateData),
    middleware('updateById|modifyById', onlyReturnName),
  ]
}
```

> `resource` is defined and represents the entity instance in `findById`, `updateById`, `modifyById` and `deleteById`.

The service also provides the option to load the relations of the entity.

```typescript
...
export class FlightCollection extends EntityResourceCollection {
  ...
  loadedRelations = {
    find: (user, params) => [ 'user' ],
    findById: (user, params) => {
      if (user.hasPerm('foo-perm')) {
        return [ 'foo' ];
      }
      return [];
    }
  }
}
```


## The `RestController`

```sh
foal g controller flight
> REST
```

- `POST /` -> service.create(...)
- `GET /` -> service.find(...)
- `GET /:id` -> service.findById(...)
- `PATCH /:id` -> service.modifyById(...)
- `PUT /:id` -> service.updateById(...)
- `DELETE /:id` -> service.deleteById(...)

The `extendParams` methods lets you extend the `params` parameter sent to the service

```typescript
...
export class FlightController extends RestController {
  collectionClass = FlightCollection;

  extendParams(ctx: Context, params: CollectionParams): CollectionParams {
    const fields = ctx.query.fields;
    if (fields && !Array.isArray(fields)) {
      fields = [ fields ];
    } 
    params.fields = fields;
    return params;
  }
}
```