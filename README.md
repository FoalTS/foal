# FoalTS

*This work is in progress.*

## Installation

```ts
npm install --save express @foal/core
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
import { FoalModule, Injectable, newExpressDecorator, rest, RestController, RestParams } from '@foal/core';

@Injectable()
class User implements RestController {
  constructor () {}

  async create(data: any, params: RestParams) {
    console.log(params.query);
    data.createdAt = Date.now();
    return data;
  }
}

const app = express();
const foal = new FoalModule({
  services: [ User ],
  controllerBindings: [ rest.bindController('/users', User) ],
  sharedControllerDecorators: [
    newExpressDecorator(bodyParser.urlencoded({ extended: false })),
    newExpressDecorator(bodyParser.json())
  ]
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

- [@foal/cli]()
- [@foal/common]()
- [@foal/sequelize]()

## License

MIT