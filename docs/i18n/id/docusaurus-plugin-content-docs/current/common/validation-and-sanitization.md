---
title: Validation & Sanitization
sidebar_label: Validation
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


**Validation** checks if an input meets a set of criteria (such as the value of a property is a string).

**Sanitization** modifies the input to ensure that it is valid (such as coercing a type).

Foal offers several utils and hooks to handle both validation and sanitization. They are particularly useful for checking and transforming parts of HTTP requests (such as the body).

## With a JSON Schema (AJV)

### Ajv, the JSON Schema Validator

FoalTS default validation and sanitization system is based on [AJV version 6](https://github.com/ajv-validator/ajv/tree/v6), a fast JSON Schema Validator. You'll find more details on how to define a shema on its [website](https://ajv.js.org/). 

### Options

Here is the list of AJV options that can be overridden with FoalTS configuration system.

| Ajv option | Configuration key | FoalTS default |
| --- | --- | --- |
| $data | `settings.ajv.$data` | - |
| allErrors | `settings.ajv.allErrors` | - |
| coerceTypes | `settings.ajv.coerceType` | true |
| removeAdditional | `settings.ajv.removeAdditional` | true |
| useDefaults | `settings.ajv.useDefaults` | true |

*Example*
<Tabs
  defaultValue="yaml"
  values={[
    {label: 'YAML', value: 'yaml'},
    {label: 'JSON', value: 'json'},
    {label: 'JS', value: 'js'},
  ]}
>
<TabItem value="yaml">

```yaml
settings:
  ajv:
    coerceTypes: true
```

</TabItem>
<TabItem value="json">

```json
{
  "settings": {
    "ajv": {
      "coerceTypes": true
    }
  }
}
```

</TabItem>
<TabItem value="js">

```javascript
module.exports = {
  settings: {
    ajv: {
      coerceTypes: true
    }
  }
}
```

</TabItem>
</Tabs>

### Validation & Sanitization of HTTP Requests

FoalTS provides many hooks to validate and sanitize HTTP requests. When validation fails, they return an `HttpResponseBadRequest` object whose body contains the validation errors.

*Example*
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
    console.log(
      ctx.request.body.firstName, ctx.request.body.lastName
    );
    return new HttpResponseOK();
  }

}
```

#### ValidateBody

It validates the request body (`Context.request.body`).

*HTTP request*

```
POST /products

{
  "price": "hello world"
}
```

*Controller (first example)*
```typescript
import { Post, ValidateBody } from '@foal/core';

export class AppController {
  @Post('/products')
  @ValidateBody({
    additionalProperties: false,
    properties: {
      price: { type: 'integer' },
    },
    required: [ 'price' ],
    type: 'object'
  })
  createProduct() {
    // ...
  }
}
```

*Controller (second example)*
```typescript
import { Post, ValidateBody } from '@foal/core';

export class AppController {
  schema = {
    additionalProperties: false,
    properties: {
      price: { type: 'integer' },
    },
    required: [ 'price' ],
    type: 'object'
  };

  @Post('/products')
  @ValidateBody(controller => controller.schema)
  createProduct() {
    // ...
  }
}
```

*HTTP response (400 - BAD REQUEST)*
```json
{
  "body": [
    {
      "instancePath": "/price",
      "keyword": "type",
      "message": "must be integer",
      "params": {
        "type": "integer"
      },
      "schemaPath": "#/properties/price/type"
    }
  ]
}
```

#### ValidateHeader

It validates the request headers (`Context.request.headers`).

*HTTP request*

```
GET /products
Authorization: xxx
A-Number: hello
```

*Controller (first example)*
```typescript
import { Post, ValidateHeader } from '@foal/core';

export class AppController {
  @Get('/products')
  @ValidateHeader('Authorization')
  @ValidateHeader('A-Number', { type: 'integer' }, { required: false })
  readProducts() {
    // ...
  }
}
```

*Controller (second example)*
```typescript
import { Post, ValidateHeader } from '@foal/core';

export class AppController {
  schema = { type: 'integer' };

  @Get('/products')
  @ValidateHeader('Authorization')
  @ValidateHeader('A-Number', c => c.schema, { required: false })
  readProducts() {
    // ...
  }
}
```

*HTTP response (400 - BAD REQUEST)*
```json
{
  "headers": [
    {
      "instancePath": "/a-number",
      "keyword": "type",
      "message": "must be integer",
      "params": {
        "type": "integer"
      },
      "schemaPath": "#/properties/a-number/type"
    }
  ]
}
```

#### ValidateCookie

It validates the request cookies (`Context.request.cookies`).

*HTTP request*

```
GET /products
Cookies: Authorization=xxx; A-Number=hello
```

*Controller (first example)*
```typescript
import { Post, ValidateCookie } from '@foal/core';

export class AppController {
  @Get('/products')
  @ValidateCookie('Authorization')
  @ValidateCookie('A-Number', { type: 'integer' }, { required: false })
  readProducts() {
    // ...
  }
}
```

*Controller (second example)*
```typescript
import { Post, ValidateCookie } from '@foal/core';

export class AppController {
  schema = { type: 'integer' };

  @Get('/products')
  @ValidateCookie('Authorization')
  @ValidateCookie('A-Number', c => c.schema, { required: false })
  readProducts() {
    // ...
  }
}
```

*HTTP response (400 - BAD REQUEST)*
```json
{
  "cookies": [
    {
      "instancePath": "/A-Number",
      "keyword": "type",
      "message": "must be integer",
      "params": {
        "type": "integer"
      },
      "schemaPath": "#/properties/A-Number/type"
    }
  ]
}
```

#### ValidatePathParam

It validates the request path parameter (`Context.request.params`).

*HTTP request*

```
GET /products/xxx
```

*Controller (first example)*
```typescript
import { Post, ValidatePathParam } from '@foal/core';

export class AppController {
  @Get('/products/:productId')
  @ValidatePathParam('productId', { type: 'integer' })
  readProducts() {
    // ...
  }
}
```

*Controller (second example)*
```typescript
import { Post, ValidatePathParam } from '@foal/core';

export class AppController {
  schema = { type: 'integer' };

  @Get('/products/:productId')
  @ValidatePathParam('productId', c => c.schema)
  readProducts() {
    // ...
  }
}
```

*HTTP response (400 - BAD REQUEST)*
```json
{
  "pathParams": [
    {
      "instancePath": "/productId",
      "keyword": "type",
      "message": "must be integer",
      "params": {
        "type": "integer"
      },
      "schemaPath": "#/properties/productId/type"
    }
  ]
}
```


#### ValidateQueryParam

It validates the request query (`Context.request.query`).

*HTTP request*

```
GET /products?authorization=xxx&a-number=hello
```

*Controller (first example)*
```typescript
import { Post, ValidateQueryParam } from '@foal/core';

export class AppController {
  @Get('/products')
  @ValidateQueryParam('authorization')
  @ValidateQueryParam('a-number', { type: 'integer' }, { required: false })
  readProducts() {
    // ...
  }
}
```

*Controller (second example)*
```typescript
import { Post, ValidateQueryParam } from '@foal/core';

export class AppController {
  schema = { type: 'integer' };

  @Get('/products')
  @ValidateQueryParam('authorization')
  @ValidateQueryParam('a-number', c => c.schema, { required: false })
  readProducts() {
    // ...
  }
}
```

*HTTP response (400 - BAD REQUEST)*
```json
{
  "query": [
    {
      "instancePath": "/a-number",
      "keyword": "type",
      "message": "must be integer",
      "params": {
        "type": "integer"
      },
      "schemaPath": "#/properties/a-number/type"
    }
  ]
}
```

### Sanitization Example

```typescript
import { Context, HttpResponseOK, Post, ValidateBody } from '@foal/core';

export class AppController {

  @Post('/no-sanitization')
  noSanitization(ctx: Context) {
    return new HttpResponseOK(ctx.request.body);
  }

  @Post('/sanitization')
  @ValidateBody({
    additionalProperties: false,
    properties: {
      age: { type: 'number' },
      name: { type: 'string' },
    },
    required: [ 'name', 'age' ],
    type: 'object'
  })
  sanitization(ctx: Context) {
    return new HttpResponseOK(ctx.request.body);
  }

}

```


Assuming that you did not change Foal's default configuration of Ajv (see above), you will get these results:

| Request | Response  |
| --- | --- |
| POST `/no-sanitization` `{ name: 'Alex', age: '34', city: 'Paris' }`| `{ name: 'Alex', age: '34', city: 'Paris' }`
| POST `/sanitization` `{ name: 'Alex', age: '34', city: 'Paris' }` | `{ name: 'Alex', age: 34 }`

### Custom Error Messages

```
npm install ajv-errors@3 ajv@8
```

You can customize the errors returned by the validation hooks by using the [ajv-errors](https://ajv.js.org/packages/ajv-errors.html) plugin.

*Configuration*

<Tabs
  defaultValue="yaml"
  values={[
    {label: 'YAML', value: 'yaml'},
    {label: 'JSON', value: 'json'},
    {label: 'JS', value: 'js'},
  ]}
>
<TabItem value="yaml">

```yaml
settings:
  ajv:
    allErrors: true
```

</TabItem>
<TabItem value="json">

```json
{
  "settings": {
    "ajv": {
      "allErrors": true
    }
  }
}
```

</TabItem>
<TabItem value="js">

```javascript
module.exports = {
  settings: {
    ajv: {
      allErrors: true
    }
  }
}
```

</TabItem>
</Tabs>

*Example*
```typescript
import { Context, getAjvInstance, HttpResponseOK, Post, ValidateBody } from '@foal/core';
import ajvErrors from 'ajv-errors';

export class AppController {

  init() {
    ajvErrors(getAjvInstance());
  }

  @Post('/products')
  @ValidateBody({
    additionalProperties: false,
    errorMessage: 'The submitted product is incorrect.',
    properties: {
      name: { type: 'string' }
    },
    required: [ 'name' ],
    type: 'object',
  })
  createProduct(ctx: Context) {
    // ...
    return new HttpResponseOK(ctx.request.body);
  }

}
```

### Referencing Schemas

The example below shows how a schema can be defined and reused in several hooks.

*Example*
```typescript
import { Context, getAjvInstance, HttpResponseOK, Post, ValidateBody } from '@foal/core';

const productSchema = {
  additionalProperties: false,
  properties: {
    name: { type: 'string' }
  },
  required: [ 'name' ],
  type: 'object',
};

export class ProductController {

  boot() {
    getAjvInstance()
      .addSchema(productSchema, 'Product');
  }

  @Post('/products')
  @ValidateBody({
    $ref: 'Product'
  })
  createProduct(ctx: Context) {
    // ...
    return new HttpResponseOK(ctx.request.body);
  }

}
```

## With a Validation Class (class-validator)

The [class-validator](https://github.com/typestack/class-validator) library can also be used in Foal to validate an object against a validation class.

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
npm install class-transformer class-validator @foal/typestack
```

If you want to use it within a hook to validate request bodies, you can install the package `@foal/typestack` for this. It provides a `@ValidateBody` hook that validates the body against a given validator. This body is also unserialized and turned into an instance of the class.

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

*social-post.controller.ts (first example)*
```typescript
import { Context, HttpResponseCreated, Post } from '@foal/core';
import { ValidateBody } from '@foal/typestack';
import { SocialPost } from './social-post.validator';

export class SocialPostController {

  @Post()
  @ValidateBody(SocialPost, { /* options if relevant */ })
  createSocialPost(ctx: Context) {
    // ctx.request.body is an instance of SocialPost.
    // ...
    return new HttpResponseCreated();
  }

}
```

*social-post.controller.ts (second example)*
```typescript
import { Context, HttpResponseCreated, Post } from '@foal/core';
import { ValidateBody } from '@foal/typestack';
import { SocialPost } from './social-post.validator';

export class SocialPostController {
  entityClass = SocialPost;

  @Post()
  @ValidateBody(controller => controller.entityClass, { /* options if relevant */ })
  createSocialPost(ctx: Context) {
    // ctx.request.body is an instance of SocialPost.
    // ...
    return new HttpResponseCreated();
  }

}
```

*HTTP request (example)*
```
POST /

{
  "text": "foo"
}
```

*HTTP response (example)*
```json
[
  {
    "children": [],
    "constraints": { "isLength": "title must be longer than or equal to 10 characters" },
    "property": "title",
    "target": { "text": "foo" },
  },
  {
    "children": [],
    "constraints": { "contains": "text must contain a hello string" },
    "property": "text",
    "target": { "text": "foo" },
    "value": "foo",
  }
]
```

The hook takes also an optional parameter to specify the options of the [class-transformer](https://github.com/typestack/class-transformer) and [class-validator](https://github.com/typestack/class-validator) libraries.

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
