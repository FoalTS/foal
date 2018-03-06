# @foal/ajv

[Ajv](https://github.com/epoberezkin/ajv) is a fast JSON Schema Validator and this package provides its implementation in FoalTS.

## `validate(schema: ObjectType, ajv = defaultInstance)`

`validate` is a pre-hook to control the data received by the server. `Ajv` validates the `context.body` with the given schema. If the validation fails then an `HttpResponseBadRequest` is returned with the validation errors as `content`.

You can provide your own instance of Ajv.

*Example*:
```typescript
import { validate } from '@foal/ajv';
import { basic, Module } from '@foal/core';

export const AppModule: Module = {
  controllers: [
    basic
      .attachHandlingFunction('POST', '/user', ctx => {
        // In this function we are sure that firstName and lastName
        // are defined thanks to the below pre-hook.
        console.log(ctx.body.firstName, ctx.body.lastName);
      })
      .withPreHook(validate({
        noAdditionalProperties: true,
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