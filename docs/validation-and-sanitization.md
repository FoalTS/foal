# Input Validation & Sanitization

**Validation** checks if an input meets a set of criteria (such as the value of a property is a string).

**Sanitization** modifies the input to ensure that it is valid (such as coercing a type).

Foal offers several utils and hooks to handle both validation and sanitization. They are particularly useful for checking and transforming parts of HTTP requests (such as the body).

## With a JSON Schema (AJV)

### Ajv, the JSON Schema Validator

The default validation and sanitization system is based on [Ajv](https://github.com/epoberezkin/ajv), a fast JSON Schema Validator. You'll find more details on how to define a shema on its [website](http://epoberezkin.github.io/ajv/). 

Foal uses this [baseline ajv configuration](https://github.com/epoberezkin/ajv#options-to-modify-validated-data) under the hood:
```typescript
{
  coerceTypes: true,  // change data type of data to match type keyword
  removeAdditional: true, // remove additional properties
  useDefaults: true, // replace missing properties and items with the values from corresponding default keyword
}
```

You can override these settings with the config file `config/default.json` or using the environment variables `SETTINGS_AJV_COERCE_TYPE`, `SETTINGS_AJV_REMOVE_ADDITIONAL` and `SETTINGS_AJV_USE_DEFAULTS`.

*Example*
```json
{
  "settings": {
    "ajv": {
      "coerceTypes": true
    }
  }
}
```

### The `validate` util

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

### Validation & Sanitization of HTTP Requests

`ValidateBody`, `ValidateCookies`, `ValidateHeaders`, `ValidateParams` and `ValidateQuery` are hooks to control the body, headers, route params and the query of the requests received by the server. They validate `context.request.{body|cookies|headers|params|query}` against the given schema. If the validation fails then an `HttpResponseBadRequest` is returned with the validation errors as `body`.

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

### Sanitization Example

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


Assuming that you did not change Foal's default configuration of Ajv (see above), you will get these results:

| Request | Response |
| --- | --- |
| GET `/no-sanitization?name=Alex&apiKey=34&city=Paris`| `{ name: 'Alex', apiKey: '34', city: 'Paris }`
| GET `/sanitization?name=Alex&apiKey=34&city=Paris` | `{ name: 'Alex', apiKey: 34 }`

## With a Validation Class (class-validator)

The [class-validator](https://github.com/typestack/class-validator#readme) library can also be used in Foal to validate an object against a validation class.

```
npm install class-validator
```

*Example*
```typescript
import {validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max} from "class-validator";
 
export class Post {

    @IsInt()
    @Min(0)
    @Max(10)
    rating: number;
 
    @IsEmail()
    email: string;
 
}
 
let post = new Post();
post.rating = 11; // should not pass
post.email = "google.com"; // should not pass
 
validate(post).then(errors => { // errors is an array of validation errors
    if (errors.length > 0) {
        console.log("validation failed. errors: ", errors);
    } else {
        console.log("validation succeed");
    }
});
```

### Usage with a Hook

```
npm install class-transformer
```

The below code shows how to create a hook to validate the request body with a validation class.

*validate-body-from-class.hook.ts*
```typescript
import { Class, Hook, HookDecorator, HttpResponseBadRequest } from '@foal/core';
import { ClassTransformOptions, plainToClass } from 'class-transformer';
import { validate, ValidatorOptions } from 'class-validator';

interface ValidateBodyFromClassOptions {
  validator?: ValidatorOptions;
  transformer?: ClassTransformOptions;
}

export function ValidateBodyFromClass(cls: Class, options: ValidateBodyFromClassOptions = {}): HookDecorator {
  return Hook(async ctx => {
    if (typeof ctx.request.body !== 'object' || ctx.request.body === null) {
      return new HttpResponseBadRequest('The request body should be a valid JSON.');
    }

    const instance = plainToClass(cls, ctx.request.body, options.transformer);
    const errors = await validate(instance, options.validator);
    if (errors.length > 0) {
      return new HttpResponseBadRequest(errors);
    }
  });
}

```

*social-post.validator.ts*
```typescript
import { Contains, Length } from 'class-validator';

export class SocialPost {

  @Length(10, 20)
  title: string;

  @Contains('hello')
  text: string;

}

```

*social-post.controller.ts*
```typescript
import { HttpResponseCreated, Post } from '@foal/core';
import { ValidateBodyFromClass } from '../hooks';
import { SocialPost } from './social-post.validator';

export class SocialPostController {

  @Post()
  @ValidateBodyFromClass(SocialPost, { /* options if relevant */ })
  createSocialPost() {
    // ...
    return new HttpResponseCreated();
  }

}
```

### Usage with TypeORM entities

The validation decorators are compatible with TypeORM entities. So you can use one single class to define both your model and validation rules.

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    @Length(10, 20)
    title: string;

    @Column()
    @Contains("hello")
    text: string;

    @Column()
    @IsInt()
    @Min(0)
    @Max(10)
    rating: number;

    @Column()
    @IsEmail()
    email: string;

    @Column()
    @IsFQDN()
    site: string;

    @Column()
    @IsDate()
    createDate: Date;

}
```