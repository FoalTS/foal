# Common controller factories

### `rest`

`rest(path: string, service: Partial<IModelService>)`

Creates a REST controller from a `Partial<IModelService>`.

```
POST /my_resource -> service.createOne(...)
GET /my_resource -> service.findMany(...)
GET /my_resource/:id -> service.findOne(...)
PATCH /my_resource/:id -> service.updateOne(...)
PUT /my_resource/:id -> service.updateOne(...)
DELETE /my_resources/:id -> service.removeOne(...)
```