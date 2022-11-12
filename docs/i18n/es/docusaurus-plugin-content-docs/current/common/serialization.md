---
title: Serialización
---


This document shows how to serialize class instances into plain objects and, conversely, how to deserialize plain objects into class instances. It is based on the [class-transformer](https://github.com/typestack/class-transformer) library.

Serialization is particularly interesting if you need to transform HTTP request bodies into model instances or, inversely, convert model instances into plain objects to be returned in HTTP responses.

## The `class-transformer` library

```
npm install class-transformer
```

The `class-transformer` has two main functions to transform objects: `plainToClass` and `classToPlain`. Some examples of their use are given below.

> _Other functions also exist and can be found in the README of the [library repository](https://github.com/typestack/class-transformer)._

*plainToClass*
```typescript
import { plainToClass } from 'class-transformer';

class User {
  firstName: string;
  lastName: string;

  getFullName() {
    return firstName +  ' ' + lastName;
  }
}

const user = {
  firstName: 'John',
  lastName: 'Doe'
}

const user2 = plainToClass(User, user);
// user2 is an instance of User
console.log(user2.getFullName());
// John Doe
```

*classToPlain*
```typescript
import { classToPlain, Exclude } from 'class-transformer';
 
export class User {
  id: number;
  email: string;
  
  @Exclude()
  password: string;
}

const user = new User();
user.id = 1;
user.email = 'jane.doe@foalts.org';
user.password = 'xxx';

const serializedUser = classToPlain(user);
console.log(serializedUser instanceof User);
// false
console.log(serializedUser);
// {
//   id: 1,
//   email: 'jane.doe@foalts.org'
// }
```

Additional options can be provided to the `classToPlain` or `plainToClass` functions. `class-transformer` also offers other interesting features (nested objects, property renaming, etc) that can be found [here](https://github.com/typestack/class-transformer#readme).

> **Caution: These functions do not validate data.** They do not guarantee that all declared properties are assigned and that no additional properties are assigned to the object. They behave more or less like a call to `Object.assign`. Please refer to the [validation page](./validation-and-sanitization.md) if you need to validate data.
 
## Usage with a Hook

```
npm install class-transformer @foal/typestack
```

If you want to use `class-transformer` within a hook to transform request bodies, you can install the package `@foal/typestack` for this. It provides a `@UnserializeBody` hook that transforms the request body into an instance of a given class.

*product.entity.ts*
```typescript
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
// BaseEntity adds the method "save" to the class.
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
```

*api.controller.ts*
```typescript
import { Context, HttpResponseCreated, Post, ValidateBody } from '@foal/core';
import { UnserializeBody } from '@foal/typestack';
import { Product } from '../entities';

export class ApiController {

  @Post('/products')
  @ValidateBody({
    additionalProperties: false,
    properties: {
      name: { type: 'string' }
    },
    required: [ 'name' ],
    type: 'object',
  })
  @UnserializeBody(Product)
  async createProduct(ctx: Context) {
    // ctx.request.body is an instance of Product
    const product = ctx.request.body;
    await product.save();
    return new HttpResponseCreated();
  }

}
```

The hook takes also an optional parameter to specify the options of the [class-transformer](https://github.com/typestack/class-transformer) library.
