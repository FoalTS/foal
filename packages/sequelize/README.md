# Foal sequelize

*This work is in progress.*

## Installation

```ts
npm install --save express @foal/core @foal/sequelize sequelize

# And one of the following:
$ npm install --save pg pg-hstore
$ npm install --save mysql2
$ npm install --save sqlite3
$ npm install --save tedious // MSSQL
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

import { Foal, rest, RestParams, Service } from '@foal/core';
import { Sequelize, SequelizeConnectionService, SequelizeService } from '@foal/sequelize';

@Service()
class Connection extends SequelizeConnectionService {
  constructor() {
    super('postgres://user:pass@example.com:5432/dbname');
  }
}

@Service()
class User extends SequelizeService {
  constructor(protected connection: Connection) {
    super('users', {
      username: Sequelize.STRING
    }, connection);
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

## License

MIT