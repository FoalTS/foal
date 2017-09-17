# FoalTS

*This work is in progress.*

## Installation

```ts
npm install --save @foal/core
```

## Get started

```ts

import * as bodyParser from 'body-parser';
import * as express from 'express';
import { FoalModule, Injectable, newExpressDecorateur, rest, RestController } from '@foal/core';

@Injectable()
class User implements RestController {
  constructor () {}

  async create(id, data, params) {
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
    newExpressDecorateur(bodyParser.urlencoded({ extended: false }),
    newExpressDecorateur(bodyParser.json())
  ]
});
app.use(foal.expressRouter());
app.listen(3000, () => console.log('Listening...'));

```

## Documentation

Find docs [here]().

## Contributing

There are several way to contribute.

- Submit a PR to fix typos/grammatical erros.
- Open an issue to report a bug.
- Open an issue to suggest a new feature.
- Improve the docs.

## Packages

- [@foal/cli]()
- [@foal/common]()
- [@foal/sequelize]()

## License

MIT