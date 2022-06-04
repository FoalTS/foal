---
title: REST API
---

This page gives an example of how to build a REST API in Foal with authentication and OpenAPI generation support.

## The API Behavior

Below is a table summarizing how the generated API works:

| *HTTP Method* | *CRUD* | *Entire Collection (e.g. `/products`)* | *Specific Item (e.g. `/products/{id}`)* |
| --- | --- | --- | --- |
| GET | Read | 200 (OK) - list of products | 200 (OK) - the product <br /> 404 (Not Found)|
| POST | Create | 201 (Created) - the created product <br /> 400 (Bad Request) - the validation error | Not implemented |
| PUT | Update/Replace | Not implemented | 200 (OK) - the updated product <br /> 400 (Bad Request) - the validation error <br /> 404 (Not Found) |
| PATCH | Update/Modify | Not implemented | 200 (OK) - the updated product <br /> 400 (Bad Request) - the validation error <br /> 404 (Not Found) |
| DELETE | Delete | Not implemented | 204 (No Content) <br /> 404 (Not Found) |

The `GET /<name>s` routes also accept two optional query parameters `skip` and `take` to handle **pagination**. If the parameters are not valid numbers, the controller responds with a 400 (Bad Request) status.

- `skip` - offset from where items should be taken.
- `take` - max number of items that should be taken.

*Example:*
```
GET /products?skip=10&take=20
```

## The Code

## Generating OpenAPI documentation

The generated controllers also have OpenAPI decorators on their methods to document the API.

In this way, when the [configuration key](../architecture/configuration.md) `settings.openapi.useHooks` is set to `true`, we can get a full documentation of the API using [Swagger UI](./openapi-and-swagger-ui.md)

![Example of documentation](./images/rest-openapi.png).