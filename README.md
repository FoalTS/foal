# ![Logo](./docs/logo_64.png) FoalTS

[![npm version](https://badge.fury.io/js/%40foal%2Fcore.svg)](https://badge.fury.io/js/%40foal%2Fcore)
[![Build Status](https://travis-ci.org/FoalTS/foal.svg?branch=add-travis)](https://travis-ci.org/FoalTS/foal)

**This work is in progress. Future releases may break current features, so use it at your own risk!**

## Installation

```ts
npm install --save express body-parser @foal/core @foal/express
```

## Get started

```json
// tsconfig.json
{
  "compilerOptions": {
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "lib": [
      "es6",
      "dom"
    ]
    ...
}
```

```ts
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { getCallback } from '@foal/express';
import { Foal, Service, rest, RestController, RestParams } from '@foal/core';

@Service()
class User implements RestController {
  constructor () {}

  async create(data: any, params: RestParams) {
    console.log(params.query);
    data.createdAt = Date.now();
    return data;
  }
}

const foal = new Foal({
  services: [ User ],
  controllerBindings: [ rest.bindController('/users', User) ]
});

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(getCallback(foal));
app.listen(3000, () => console.log('Listening...'));

```

## Documentation

Find docs [here](https://foalts.gitbooks.io/docs/content/).

## Contributing

There are several ways to contribute.

- Submit a PR to fix typos/grammatical errors.
- Open an issue to report a bug.
- Open an issue to suggest a new feature.
- Improve the docs.

## Packages

- @foal/core
- @foal/sequelize

## License

MIT