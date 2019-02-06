# Input Validation & Sanitization

**Validation** checks if an input meets a set of criteria (such as the value of a property is a string).

**Sanitization** modifies the input to ensure that it is valid (such as coercing a type).

Foal offers several utils and hooks to handle both validation and sanitization. They are particularly useful for checking and transforming parts of the HTTP requests (such as the body).

## Ajv, the JSON Schema Validator

The validation and sanitization system is based on [Ajv](https://github.com/epoberezkin/ajv), a fast JSON Schema Validator. You'll find more details on how to define a shema on its [website](http://epoberezkin.github.io/ajv/). 

Foal uses this [baseline ajv configuration](https://github.com/epoberezkin/ajv#options-to-modify-validated-data) under the hood:
```typescript
{
  coerceTypes: true,  // change data type of data to match type keyword
  removeAdditional: true, // remove additional properties
  useDefaults: true, // replace missing properties and items with the values from corresponding default keyword
}
```

## The `validate` util

The `validate` util throws a `ValidationError` if the given data does not fit the shema.

*Example*
```typescript
import { validate } from '@foal/core';

const schema = {
  properties: {
    a: { type: 'number' }
  },
  type: 'object'
};
const data = {
  a: 'foo'
};

validate(schema, data);
// => Throws an error (ValidationError)
// => error.content contains the details of the validation error.
```

## Validation & Sanitization of HTTP Requests

`ValidateBody`, `ValidateHeaders`, `ValidateParams` and `ValidateQuery` are hooks to control the body, headers, route params and the query of the requests received by the server. They validate `context.request.{body|headers|params|query}` against the given schema. If the validation fails then an `HttpResponseBadRequest` is returned with the validation errors as `body`.

*Example*:
```typescript
import { Context, HttpResponseOK, Post, ValidateBody } from '@foal/core';

export class MyController {

  @Post('/user')
  @ValidateBody({
    additionalProperties: false,
    properties: {
      firstName: { type: 'string' },
      lastName: { type: 'string' },
    },
    required: [ 'firstName', 'lastName' ],
    type: 'object'
  })
  postUser(ctx: Context) {
    // In this method we are sure that firstName and lastName
    // are defined thanks to the above hook.
    console.log(ctx.request.body.firstName, ctx.request.body.lastName);
    return new HttpResponseOK();
  }

}

```

In this example, if you try to `POST /user` with a JSON object that does not have a `firstName` property, you'll get returned a `400 BAD REQUEST` with this body:

```json
[
    {
        "keyword": "required",
        "dataPath": "",
        "schemaPath": "#/required",
        "params": {
            "missingProperty": "firstName"
        },
        "message": "should have required property 'firstName'"
    }
]
```

## Sanitization Example

```typescript
import { Get, HttpResponseOK, ValidateQuery } from '@foal/core';

export class AppController {

  @Get('/no-sanitization')
  noSanitization(ctx) {
    return new HttpResponseOK(ctx.request.query);
  }

  @Get('/sanitization')
  @ValidateQuery({
    additionalProperties: false,
    properties: {
      name: { type: 'string' },
      apiKey: { type: 'number' },
    },
    required: [ 'name', 'apiKey' ],
    type: 'object'
  })
  sanitization(ctx) {
    return new HttpResponseOK(ctx.request.query);
  }

}

```

| Request | Response |
| --- | --- |
| GET `/no-sanitization?name=Alex&apiKey=34&city=Paris`| `{ name: 'Alex', apiKey: '34', city: 'Paris }`
| GET `/sanitization?name=Alex&apiKey=34&city=Paris` | `{ name: 'Alex', apiKey: 34 }`