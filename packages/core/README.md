# FoalTS

**This work is in progress. Future releases may break current features, so use it at your own risk!**

## Installation

```ts
npm install --save express body-parser @foal/core
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

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const foal = new Foal({
  services: [ User ],
  controllerBindings: [ rest.bindController('/users', User) ]
});
app.use(foal.expressRouter());
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