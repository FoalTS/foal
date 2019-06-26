# Configuration

In FoalTS, _configuration_ refers to any parameter that may vary between deploy environments (production, development, test, etc). It includes sensitive information, such as your database credentials, or simple settings, such as the server port.

The framework encourages a **strict separation between configuration and code** and allows you to define your configuration in environment variables, in an `.env` file or in files in the `config/` directory. You can choose one of these techniques or use them all simultaneously.

*Config directory structure*
```
|- config/
| |- e2e.json
| |- default.json
| |- development.json
| |- production.json
| |- ...
| '- test.json
|- src/
'- .env
```

## Architecture of a Configuration File

*Example of `.env` file*

```
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
SETTINGS_CSRF_SECRET=YKvV281Z8nbkPowDLkMTTIrg
```

*Example of a file in the `config/` directory*

Both formats, JSON and YAML, are supported. Choose the one that suits you the best.

```json
{
  "port": 3001,
  "settings": {
    "csrf": false,
    "debug": false,
    "loggerFormat": "tiny",
    "staticPath": "public/",
    "session": {
      "cookie": {
        "path": "/"
      },
      "secret": "my-secret"
    }
  },
  "database": {
    "database": "./db.sqlite3"
  }
}
```

```yaml
port: 3001

settings:
  csrf: false
  debug: false
  loggerFormat: tiny
  staticPath: public/
  session:
    cookie:
      path: /
    secret: my-secret

database:
  database: './db.sqlite3'
```

> **YAML support**
>
> The use of YAML for configuration requires the installation of the package `yamljs`.
>
> ```
> npm install yamljs
> ```
>
> When creating a new project, you can also add the flag `--yaml` to have all the configuration directly generated in YAML.
>
> ```
> foal createapp my-app --yaml
> ```
>
> The extension of the YAML files must be `.yml`.

## Accessing Configuration Values

Configuration can be read using the static class `Config` and its method `get`.

```typescript
import { Config } from '@foal/core';

const secret = Config.get('settings.jwt.secretOrPublicKey');
```

In the above example, the `Config` will search for these configurations. If none is found, then `undefined` is returned.

*`.env` file or environment variable (example)*
```
SETTINGS_JWT_SECRET_OR_PUBLIC_KEY=xxx
```

*`default.json` file (or `production.json`, `test.json`, etc) (example)*
```json
{
  "settings": {
    "jwt": {
      "secretOrPublicKey": "xxx"
    }
  }
}
```

The method also accepts a default value if no value is found in the configuration.

```typescript
import { Config } from '@foal/core';

const debug = Config.get('settings.debug', false);
```

> **Type coercion**
>
> Environment variable values are auto-converted to numbers and booleans whenever possible. The same goes for `.env` values.
>
> *`.env` file (example)*
> ```
> SETTINGS_SESSION_EXPIRATION_TIMEOUTS_INACTIVITY=3600
> ```
>
> ```typescript
>import { Config } from '@foal/core';
>
> const expTimout = Config.get('settings.session.expirationTimeouts.inactivity');
> // expTimout is of type "number" (not "string")
> ```

--

> **Type variable**
>
> By default, `Config.get` return type is `any`. You can change this value to another type if needed.
>
> ```typescript
> import { Config } from '@foal/core';
> 
> const debug = Config.get<boolean>('settings.debug');
> ```
> 
> Note that this technique only forces the *TypeScript type* which may be different from the *real* JavaScript type.

## Configuration & FoalTS Components

As mentioned before, FoalTS encourages a strict separation between configuration and code. This is why most FoalTS components (services, controller, hooks) retreive their configuration directly from the config files or environment variables. They use the namespace `settings` for this purpose.

For example, FoalTS uses the configuration key `settings.debug` to determine if error tracebacks should be returned in the *INTERNAL SERVER ERROR* responses.

You should not create new configuration keys in the `settings` namespace as this may conflict with future versions of the framework.

*default.yml (default)*
```yml
port: 3001

settings:
  // You should not define your own configuration keys in this section.
  // Use only those specified in the documentation.
  debug: true

// Custom configuration
my_custom_config:
  config1: 'foobar'

// Custom configuration
my_custom_config2:
  age: 32

```

## Precedence of the Configuration

Configuration specified in the `.env` file overrides the one defined in the `config/` directory files. And configuration specified in environment variables overrides the one defined in the `.env` file.

> **Use case**
>
> PaaS providers often require that web applications be served on a specific port (`8080`, `80`, etc.) that may be different from the one you use locally. Usually, the value of this port is specified in an environment variable named `PORT`. With FoalTS configuration system, the port is automatically replaced when your project is deployed and the application works as expected.

The `config/` directory files also have a precedence system inside the directory. If your node environment is `production` (defined with the environment variable `NODE_ENV`), then the `production.json` file (if it exists) overrides the file `default.json`.

## Database Configuration (TypeORM)

> This section describes changes introduced in version 1.0.0. Instructions to upgrade to the new release can be found [here](https://github.com/FoalTS/foal/releases/tag/v1.0.0). Old documentation can be found [here]().

TypeORM uses a [different system](http://typeorm.io/#/using-ormconfig) for its configuration based on the file `ormconfig.js` located at the root of the project directory.

You can however customize the `ormconfig.js` file to make it work with FoalTS configuration system.

*ormconfig.js (example)*
```js
const { Config } = require('@foal/core');

module.exports = {
  type: "sqlite",
  database: Config.get('database.database'),
  dropSchema: Config.get('database.dropSchema', false),
  entities: ["build/app/**/*.entity.js"],
  migrations: ["build/migrations/*.js"],
  cli: {
    migrationsDir: "src/migrations"
  },
  synchronize: Config.get('database.synchronize', false)
}

```

*default.yml (example)*
```yml
port: 3001

settings:
  ...

database:
  database: './db.sqlite3'
```

*test.yml (example)*
```yml
database:
  database: './test_db.sqlite3'
  dropSchema: true
  synchronize: true
```

## Advanced

### Using `Config` as a Service

In order to mock the configuration during the tests, you can also use `Config` as a service. This is particularly useful for testing reusable components (hook, service) whose behavior varies according to the configuration.

*app.controller.ts (example)*
```TypeScript
import { Config, dependency, Get } from '@foal/core';

export class AppController {
  @dependency
  config: Config;

  @Get('/')
  get() {
    const debug = this.config.get<boolean>('debug');
    // Do something.
  }

}
```

*app.controller.spec.ts (example)*
```typescript
import { createController, ConfigMock } from '@foal/core';

import { AppController } from './app.controller';

describe('AppController', () => {

  let config: ConfigMock;
  let controller: AppController;

  before(() => {
    config = new ConfigMock();
    controller = createController(AppController, { config });
  });

  beforeEach(() => config.reset());

  it('should do something (debug=true).', () => {
    config.set(debug, true);
    // ...
  })

  it('should do another something (debug=false).', () => {
    config.set(debug, false);
    // ...
  })

})
```

