---
title: Hooks
---


```sh
npx foal generate hook my-hook
```

## Description

Hooks are decorators that execute extra logic before and/or after the execution of a controller method.

They are particulary useful in these scenarios:
- authentication & access control
- request validation & sanitization
- logging

They improve code readability and make unit testing easier.

## Built-in Hooks

Foal provides a number of hooks to handle the most common scenarios.

- `ValidateBody`, `ValidateHeader`, `ValidatePathParam`, `ValidateCookie` and `ValidateQueryParam` validate the format of the incoming HTTP requests (see [Validation](../common/validation-and-sanitization.md)).
- `JWTRequired`, `JWTOptional`, `UseSessions` authenticate the user by filling the `ctx.user` property.
- `PermissionRequired` restricts the route access to certain users.

## Use

A hook can decorate a controller method or the controller itself. If it decorates the controller then it applies to all its methods and sub-controllers.

In the below example, `JWTRequired` applies to `listProducts` and `addProduct`.

*Example:*
```typescript
import {
  Context, Get, HttpResponseCreated, HttpResponseOK, Post, ValidateBody
} from '@foal/core';
import { JWTRequired } from '@foal/jwt';

@JWTRequired()
class AppController {
  private products = [
    { name: 'Hoover' }
  ];

  @Get('/products')
  listProducts() {
    return new HttpResponseOK(this.products);
  }

  @Post('/products')
  @ValidateBody({
    additionalProperties: false,
    properties: {
      name: { type: 'string' }
    },
    required: [ 'name' ],
    type: 'object',
  })
  addProduct(ctx: Context) {
    this.products.push(ctx.request.body);
    return new HttpResponseCreated();
  }

}
```

If the user makes a POST request to `/products` whereas she/he is not authenticated, then the server will respond with a 400 error and the `ValidateBody` hook and `addProduct` method won't be executed.

> If you need to apply a hook globally, you just have to make it decorate the root controller: `AppController`.
>
> ```typescript
> @UseSessions()
> export class AppController {
>  // ...
> }
> ```


## Build Custom Hooks

In addition to the hooks provided by FoalTS, you can also create your own.

A hook is made of a small function, synchronous or asynchronous, that is executed before the controller method.

To create one, you need to call the `Hook` function.

*Example:*
```typescript
import { Get, Hook, HttpResponseOK } from '@foal/core';

class MyController {

  @Get('/')
  @Hook(() => {
    console.log('Receiving GET / request...');
  })
  index() {
    return new HttpResponseOK('Hello world!');
  }

}
```

The hook function can take two parameters: the `Context` object and the service manager. The [Context object](./controllers.md) is specific to the request and gives you information on it. The service manager lets you access any service through its `get` method.

*Example:*
```typescript
import { Get, Hook, HttpResponseOK } from '@foal/core';

class Logger {
  log(message: string) {
    console.log(`${new Date()} - ${message}`);
  }
}

class MyController {

  @Get('/')
  @Hook((ctx, services) => {
    const logger = services.get(Logger);
    logger.log('IP: ' + ctx.request.ip);
  })
  index() {
    return new HttpResponseOK('Hello world!');
  }

}
```

A hook function can return an `HttpResponse` object. If so, the remaining hooks and the controller method are not executed and the object is used to render the HTTP response.

*Example:*
```typescript
import { Context, Hook, HttpResponseBadRequest, HttpResponseOK, Post } from '@foal/core';

class MyController {

  @Post('/')
  @Hook((ctx: Context) => {
    if (typeof ctx.request.body.name !== 'string') {
      return new HttpResponseBadRequest();
    }
  })
  index() {
    return new HttpResponseOK('Hello world!');
  }

}
```

You can also have access to the controller instance through the `this` keyword.

*Example*
```typescript
import { getAjvInstance, Hook, HttpResponseBadRequest, HttpResponseOK, Post } from '@foal/core';

class MyController {

  schema = {
    properties: {
      price: { type: 'number' }
    },
    type: 'object',
  };

  @Post('/')
  @Hook(function (this: MyController, ctx, services) {
    const ajv = getAjvInstance();
    const requestBody = ctx.request.body;
    if (!ajv.validate(this.schema, requestBody)) {
      return new HttpResponseBadRequest(ajv.errors);
    }
  })
  index() {
    return new HttpResponseOK('Hello world!');
  }

}
```

### Executing Logic After the Controller Method

A hook can also be used to execute extra logic after the controller method. To do so, you can return a *hook post function* inside the hook. This function will be executed after the controller method. It takes exactly one parameter: the `HttpResponse` object returned by the controller.

The below example shows how to add a custom cookie to the response returned by the controller.

```typescript
import { Get, Hook, HttpResponseOK } from '@foal/core';

class MyController {

  @Get('/')
  @Hook(() => response => {
    response.setCookie('X-CSRF-TOKEN', 'xxx');
  })
  index() {
    return new HttpResponseOK('Hello world!');
  }

}
```

This example shows how to execute logic both before and after the controller method.

```typescript
import { Get, Hook, HttpResponseOK } from '@foal/core';

class MyController {

  @Get('/')
  @Hook(() => {
    const time = process.hrtime();

    return () => {
      const seconds = process.hrtime(time)[0];
      console.log(`Executed in ${seconds} seconds`);
    };
  })
  index() {
    return new HttpResponseOK('Hello world!');
  }

}
```

## Grouping Several Hooks into One

In case you need to group several hooks together, the `MergeHooks` function can be used to do this.

```typescript
import { Get, HttpResponseOK, MergeHooks, ValidateCookie, ValidateHeader } from '@foal/core';

// Before

class MyController {
  @Get('/products')
  @ValidateHeader('Authorization')
  @ValidateCookie('foo')
  readProducts() {
    return new HttpResponseOK();
  }
}

// After

function ValidateAll() {
  return MergeHooks(
    ValidateHeader('Authorization'),
    ValidateCookie('foo')
  );
}

class MyController {
  @Get('/products')
  @ValidateAll()
  readProducts() {
    return new HttpResponseOK();
  }
}
```

## Testing Hooks

Hooks can be tested thanks to the utility `getHookFunction` (or `getHookFunctions` if the hook was made from several functions).

```typescript
// validate-body.hook.ts
import { Hook, HttpResponseBadRequest } from '@foal/core';

export function ValidateBody() {
  return Hook(ctx => {
    if (typeof ctx.request.body.name !== 'string') {
      return new HttpResponseBadRequest();
    }
  });
}
```

```typescript
// validate-body.hook.spec.ts
import {
  Context, getHookFunction,
  isHttpResponseBadRequest, ServiceManager
} from '@foal/core';
import { ValidateBody } from './validate-body.hook';

it('ValidateBody', () => {
  const ctx = new Context({
    // fake request object
    body: { name: 3 }
  });
  const hook = getHookFunction(ValidateBody());
  
  const response = hook(ctx, new ServiceManager());

  if (!isHttpResponseBadRequest(response)) {
    throw new Error('The hook should return an HttpResponseBadRequest object.');
  }
});
```

### Testing Hook Post Functions

```typescript
// add-xxx-header.hook.ts
import { Hook } from '@foal/core';

export function AddXXXHeader() {
  return Hook(ctx => response => {
    response.setHeader('XXX', 'YYY');
  });
}
```

```typescript
// add-xxx-header.hook.spec.ts
import { strictEqual } from 'assert';
import {
  Context, getHookFunction, HttpResponseOK,
  isHttpResponse, ServiceManager
} from '@foal/core';
import { AddXXXHeader } from './add-xxx-header.hook';

it('AddXXXHeader', async () => {
  const ctx = new Context({});
  const hook = getHookFunction(AddXXXHeader());
  
  const postHookFunction = await hook(ctx, new ServiceManager());
  if (postHookFunction === undefined || isHttpResponse(postHookFunction)) {
    throw new Error('The hook should return a post hook function');
  }

  const response = new HttpResponseOK();
  await postHookFunction(response);

  strictEqual(response.getHeader('XXX'), 'YYY');
});
```

### Testing Hooks that Use `this`

```typescript
// validate-param-type.hook.ts
import { Context, Hook, HttpResponseBadRequest } from '@foal/core';

export function ValidateParamType() {
  return Hook(function(this: any, ctx: Context) {
    if (typeof ctx.request.params.id !== this.paramType) {
      return new HttpResponseBadRequest();
    }
  });
}
```

```typescript
// validate-param-type.hook.spec.ts
import { Context, getHookFunction, HttpResponseBadRequest } from '@foal/core';
import { ValidateParamType } from './validate-param-type';

it('ValidateParamType', () => {
  const ctx = new Context({
    // fake request object
    params: { id: 'xxx' }
  });
  const controller = {
    paramType: 'number'
  };
  const hook = getHookFunction(ValidateParamType()).bind(controller);

  const response = hook(ctx, new ServiceManager());

  if (!isHttpResponseBadRequest(response)) {
    throw new Error('The hook should return an HttpResponseBadRequest object.');
  }
});
```

### Mocking services

You can mock services by using the `set` method of the service manager.

*Example:*
```typescript
// authenticate.hook.ts
import { Hook } from '@foal/core';

export class UserService {
  private users: any = {
    eh4sb: { id: 1, name: 'John' },
    kadu5: { id: 2, name: 'Mary' }
  };

  getUser(key: string) {
    return this.users[key] ?? null;
  }
}

export const authenticate = Hook((ctx, services) => {
  const users = services.get(UserService);
  ctx.user = users.getUser(ctx.request.params.key);
});
```

```typescript
// authenticate.hook.spec.ts
import { strictEqual } from 'assert';
import { Context, getHookFunction, ServiceManager } from '@foal/core';
import { authenticate, UserService } from './authenticate.hook';

it('authenticate', () => {
  const hook = getHookFunction(authenticate);

  const user = { id: 3, name: 'Bob' };

  new Context({ params: { key: 'xxx' }});
  const services = new ServiceManager();
  services.set(UserService, {
    getUser() {
      return user;
    }
  })
  
  hook(ctx, services);

  strictEqual(ctx.user, user);
});
```

## Hook factories

Usually, we don't create hooks directly but with hook factories. Thus it is easier to customize the hook behavior on each route.

*Example:*
```typescript
import { Get, Hook, HttpResponseOK } from '@foal/core';

function Log(msg: string) {
  return Hook(() => { console.log(msg); });
}

class MyController {
  @Get('/route1')
  @Log('Receiving a GET /route1 request...')
  route1() {
    return new HttpResponseOK('Hello world!');
  }

  @Get('/route2')
  @Log('Receiving a GET /route2 request...')
  route2() {
    return new HttpResponseOK('Hello world!');
  }
}
```

## Forward Data Between Hooks

If you need to transfer data from one hook to another or to the controller method, you can use the `state` property of the `Context` object to do so.

```typescript
import { Context, Get, Hook, HttpResponseOK, UserRequired } from '@foal/core';
import { Org } from '../entities';

function AddOrgToContext() {
  return Hook(async (ctx: Context<any, { org: Org }>) => {
    if (ctx.user) {
      ctx.state.org = await Org.findOneByOrFail({ id: ctx.user.orgId });
    }
  })
}

export class ApiController {

  @Get('/org-name')
  @UserRequired()
  @AddOrgToContext()
  readOrgName(ctx: Context<any, { org: Org }>) {
    return new HttpResponseOK(ctx.state.org.name);
  }

}
```
