# Validation
// Add a little get-started (some code or a cli command)
## `Validate(schema: object, ajv = defaultInstance)`

`validate` is a hook to control the data received by the server. [Ajv](https://github.com/epoberezkin/ajv), a fast JSON Schema Validator, validates the `context.request.body` with the given schema. If the validation fails then an `HttpResponseBadRequest` is returned with the validation errors as `content`.

You can provide your own instance of Ajv.

*Example*:
```typescript
import { route, Module, validate } from '@foal/core';

export const AppModule: Module = {
  controllers: [
    route('POST', '/user', ctx => {
      // In this function we are sure that firstName and lastName
      // are defined thanks to the below hook.
      console.log(ctx.request.body.firstName, ctx.request.body.lastName);
    })
      .withPreHook(Validate({
        additionalProperties: false,
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
        }
        required: [ 'firstName', 'lastName' ],
        type: 'object'
      })),
  ]
}

```

Please visit [the official Ajv website](http://epoberezkin.github.io/ajv/) to learn more on Ajv.
