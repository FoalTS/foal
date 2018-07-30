# REST API

## Create a REST controller from an entity (simple model)

### Create the entity

```sh
foal g entity flight
```

### Create the serializer

```sh
foal g service flight
> EntitySerializer
```

### Create the controller

```sh
foal g controller flight
> REST
```

### Register the controller within a module

```typescript
...

@Module()
export class AppModule implements IModule {
  controllers = [
    controller('/flights', FlightController),
  ];
}
```

## Create a REST controller from another serializer

- `POST /` -> service.createOne(...)
- `GET /` -> service.findMany(...)
- `GET /:id` -> service.findOne(...)
- `PATCH /:id` -> service.updateOne(...)
- `PUT /:id` -> service.updateOne(...)
- `DELETE /:id` -> service.removeOne(...)

```typescript
// ./services/train.service.ts
import { ISerializer, Service } from '@foal/core';

export interface Train {
  id: string
  name: string;
}

@Service()
export class TrainService implements Partial<ISerializer> {
  private id = 0;

  createOne(data: Partial<Train>): Train {
    this.id++;
    return { ...data, id: this.id };
  }

  // Other methods are available.
}
```

