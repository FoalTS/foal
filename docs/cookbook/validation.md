# Validation

`ValidateBody` is a hook to control the data received by the server. [Ajv](https://github.com/epoberezkin/ajv), a fast JSON Schema Validator, validates the `context.request.body` with the given schema. If the validation fails then an `HttpResponseBadRequest` is returned with the validation errors as `content`.

You can provide your own instance of Ajv.

*Example*:
```typescript
@Controller()
export class MyController {

  @Post('/user')
  @ValidateBody({
    additionalProperties: false,
    properties: {
      firstName: { type: 'string' },
      lastName: { type: 'string' },
    }
    required: [ 'firstName', 'lastName' ],
    type: 'object'
  })
  postUser(ctx: Context) {
    // In this function we are sure that firstName and lastName
    // are defined thanks to the above hook.
    console.log(ctx.request.body.firstName, ctx.request.body.lastName);
  }

}

```

Please visit [the official Ajv website](http://epoberezkin.github.io/ajv/) to learn more on Ajv.
