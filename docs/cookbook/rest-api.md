# REST API
// Add a little get-started (some code or a cli command)

Three points:
- a REST controller
- a serializer
- and a (several) model(s)

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