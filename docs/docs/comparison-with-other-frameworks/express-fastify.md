---
title: Foal vs Express or Fastify
sidebar_label: Express / Fastify
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

These pages are definitely the most difficult to write. If you are here, it is probably because you want to know if you should choose Foal over another framework. There are many in the Node ecosystem and choosing one is not always an easy task. These pages are meant to help you on your way.

Of course, we prefer FoalTS because we sincerely believe that it solves a number of problems better than other existing frameworks. And so we may have some bias. However, we will try in these pages to be as objective and sincere as possible to show you the differences between FoalTS and other frameworks.

In addition, we would also recommend that you download and test them yourself. You'll be able to make your own opinion about each of them and choose the one that suits you best.

:::info

This page is evolutive. Feel free to suggest changes if you think something is missing, incorrect or outdated!

:::

## Comparison Overview

### Express and Fastify are Minimalist

[Express](https://expressjs.com/) and [Fastify](https://www.fastify.io/) are both low-level frameworks that mainly take care of routing requests, handling errors, and parsing cookies, URLs, headers and bodies. They present themselves as *fast*, *minimalist* and *low overhead* and are not intented to be provided with a complete environment (CLI, ORM, auth, access control, test tools, etc).

Foal, on the other hand, aims to provide in one place all the code and tools needed to build a complete Web application. When you start a new project with Foal, for example, you have a CLI to generate files, utilities to handle authentication and access control, and a dependency injection system to test your application.

If you want to have as much freedom as possible and are ready to start a project completely from scratch, Express or Fastify seems to be the right choice for you. You will then have to search for the packages you need on npm and the documentation to use and assemble them.

If you are looking for a more complete framework that provides everything needed to build a web application in one place and in a consistent manner, then Foal is probably the best option.

FoalTS is not a closed framework though. If you want to use other libraries than those offered by the framework (password hashing, ORM) at some point, you still can. Its architecture is not restrictive either and it will adapt to you as the application grows.

### TypeScript vs JavaScript

Express and Fastify are frameworks written in vanilla JavaScript. Foal is written in TypeScript.

It is possible to use Express and Fastify with TypeScript, but this has some disadvantages compared to Foal:
- Express does not provide TypeScript types by itself, so you have to import the `@types/express` package which has already been unstable between patch versions in the past.
- Fastify provides TS types but, as they are separate from the code base, some parts of the API will not be typed or may be typed incorrectly as mentioned in the [official documentation](https://www.fastify.io/docs/latest/Reference/TypeScript/#typescript).

Foal, on the other hand, is written entirely in TypeScript, designed to be used with TypeScript, with API types always up-to-date.

### Activity and Maintenance

| Framework | First 0.x release | First 1.x release |
| --- | --- | --- |
| Express | 2010 | 2010 |
| Fastify | 2016 | 2018 |
| Foal | 2017 | 2019 |

Express is in maintenance mode. As of March 2022, the last minor release was 3 years ago.

Fastify and Foal are both actively maintained with regular releases of new versions in recent years.

### Community

Express and Fastify have much larger communities than Foal.

Foal's community is smaller but it's growing. If you're looking for help, feel free to join us on our [Discord server](https://discord.gg/QUrJv98).

## Code Examples

> We're looking for small and concrete examples to complete this section. Feel free to suggest one on [Github](https://github.com/FoalTS/foal/tree/master/docs/docs/comparison-with-other-frameworks/express-fastify.md). 👍

### A simple route

<Tabs
  defaultValue="FoalTS"
  values={[
    {label: 'FoalTS', value: 'FoalTS'},
    {label: 'Express', value: 'Express'}
  ]}
>
<TabItem value="FoalTS">

```typescript
import { Get, HttpResponseOK } from '@foal/core';
import { Product } from '../entities';

export class ProdutController {
  @Get('/products')
  readProducts() {
    const products = await Product.find({});
    return new HttpResponseOK(products);
  }
}
```

</TabItem>
<TabItem value="Express">

```typescript
import { Router } from 'express';
import { Product } from '../entities';

const productRouter = Router();

// Express router does not support promises, so those that are rejected must be caught.
productRouter.get('/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.send(products);
  } catch (err) {
    next(err);
  }
})

export { productRouter }
```

</TabItem>
</Tabs>

### Unit testing on a simple route

<Tabs
  defaultValue="FoalTS"
  values={[
    {label: 'FoalTS', value: 'FoalTS'},
    {label: 'Express', value: 'Express'}
  ]}
>
<TabItem value="FoalTS">

*Code*
```typescript
import { Context Get, HttpResponseOK } from '@foal/core';

export class ComputerController {
  @Get('/fullname')
  computeFullname({ request }: Context) {
    const firstName = request.params.firstName;
    const lastName = request.params.lastName;
    return new HttpResponseOK(`${firstName} ${lastName}`);
  }
}
```

*Test*
```typescript
import { strictEqual } from 'assert';
import { Context, HttpResponseOK } from '@foal/core';

import { ComputerController } from './computer.controller';

it('computeFullname should return the full name.', () => {
  const ctx = new Context({
    params: { firstName: 'Hello', lastName: 'World' }
  });

  const controller = new ComputerController();
  const response = controller.computeFullname(ctx);

  if (!(response instanceof HttpResponseOK)) {
    throw new Error('The returned status shoud be 200.');
  }

  strictEqual(response.body, 'Hello World');
});
```

</TabItem>
<TabItem value="Express">

*Code*
```typescript
import { Router } from 'express';

const computerRouter = Router();

async function computeFullname(req, res) {
  const firstName = req.params.firstName;
  const lastName = req.params.lastName;
  res.status(200).send(`${firstName} ${lastName}`)
}

computerRouter.get('/fullname', computeFullname);

export { computerRouter, computeFullname }
```

*Test*
```typescript
import { strictEqual } from 'assert';

import { computeFullname } from './computer.controller';

it('computeFullname should return the full name.', () => {
  let actualStatus;
  let actualBody;

  const req = {
    params: { firstName: 'Hello', lastName: 'World' }
  };
  const res = {
    status(status) {
      actualStatus = status;
      return status;
    }
    send(body) {
      actualBody = body;
    }
  }

  computeFullname(req, res);

  strictEqual(actualStatus, 200);
  strictEqual(actualBody, 'Hello World');
});
```

</TabItem>
</Tabs>
