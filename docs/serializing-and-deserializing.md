# Seriazalizing and Deserializing

This document shows how to serialize class instances into plain objects and, conversely, how to deserialize plain objects into class instances. It is based on the [class-transformer](https://github.com/typestack/class-transformer) library.

Serialization is particularly interesting if you need to transform HTTP request bodies into model instances or, inversely, convert model instances into plain objects to be returned in HTTP responses.

```
npm install class-transformer
```

## The `class-tranformer` library

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

The below code shows how to create a hook to unserialize the request body.

*unserialize-body.hook.ts*
```typescript
import { Class, Hook, HookDecorator, HttpResponseBadRequest } from '@foal/core';
import { ClassTransformOptions, plainToClass } from 'class-transformer';

export function UnserializeBody(cls: Class, options?: ClassTransformOptions): HookDecorator {
  return Hook(ctx => {
    if (typeof ctx.request.body !== 'object' || ctx.request.body === null) {
      return new HttpResponseBadRequest('The request body should be a valid JSON.');
    }
    ctx.request.body = plainToClass(cls, ctx.request.body, options);
  });
}

```

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
import { HttpResponseCreated, Post, ValidateBody } from '@foal/core';
import { Product } from '../entities';
import { UnserializeBody } from '../hooks';

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
  async createProduct(ctx) {
    // ctx.request.body is an instance of Product
    const product = ctx.request.body;
    await product.save();
    return new HttpResponseCreated();
  }

}
```