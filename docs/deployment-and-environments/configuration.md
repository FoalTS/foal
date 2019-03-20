# Configuration

```typescript
Config.get<string|undefined>('mongodb.uri');
Config.get<boolean>('settings.debug', false);
```

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

*Example of config file*
```json
{
  "mongodb": {
    "uri": "mongodb://localhost:27017/test"
  },
  "settings": {
    "debug": true
  }
}
```

Separating configuration from the codebase has many advantages. It
- centralizes your configuration in one place for convenience,
- removes sensitive information (such as credentials) from the code,
- and lets you configure your application for different environments / deployments.

## Different Approaches

There are several ways to accessing configuration values. These are usually stored in config files (`.env`, `.json`, `.yml`) or in environment variables. FoalTS lets you use both these options.

## The `Config` Class and its Resolution Algorithm

The framework provides a static class `Config` to access environment variables and config file values. Its `get` method uses the below algorithm to retreive the desired value.

For example, if it is called with the string `settings.session.secret`, the `get` method will go through these steps:

1. If the environment variabled `SETTINGS_SESSION_SECRET` exists, then return its value.
1. If `.env` exists and has a line `SETTINGS_SESSION_SECRET=`, then return its value.
1. If `config/${NODE_ENV}.json` exists and the property `config['settings']['session']['secret']` does too, then return its value.
1. Same with `config/${NODE_ENV}.yml`.
1. If `config/default.json` exists and the property `config['settings']['session']['secret']` does too, then return its value.
1. Same with `config/default.yml`.

If none value is found, then the method returns the default value provided as second argument to the function. If none was given, it returns `undefined`.

> The `get` method also accepts a *type variable* to specify the type of the returned value. Example: `Config.get<number>('port')`.

> Environment variable values are auto-converted to numbers and booleans whenever possible. The same goes for `.env` values.

## The `settings` Section

You may find a `settings` section in your configuration files. This section is used by the official packages of Foal. You can edit its variables and add those specified in the documentation. But try not to create new ones to avoid further conflicts. Prefer to use another section for this.

*Example*
```json
{
  "settings": {
    "jwt": { // Config values of the @foal/jwt package
      "cookieName": "auth"
    }
  },
  "my-section": {
    "my-key": "my-value"
  }
}
```

## TypeORM Configuration

TypeORM uses a different system for its configuration. It uses the `ormconfig.json` file located in the root directory. You'll find more information [here](http://typeorm.io/#/using-ormconfig).

## Using YAML

FoalTS offers the possibility to use YAML files instead of JSON ones. To use this format, you need to pass the `--yaml` flag when creating a new application.

```
foal createapp --yaml
```

If you already have an existing project that you want to migrate, you can install the `yaml` package and change your existing JSON files to YAML.

*Example of yaml configuration file:*
```yaml
port: 3001

settings:
  session:
    cookie:
      httpOnly: true
      maxAge: 3600000
      sameSite: lax
      secure: true
    name: id
  jwt:
    secretOrPublicKey: 'xxx'
    cookieName: 'xxx'

mongodb:
  uri: 'mongodb://localhost:27017/db'
```

## Using `Config` as a Service

Sometimes, we want to use the `Config` as a service so that we can mock it during testing. To do this, simply set `Config` as a dependency of your controller / service, just like any other regular service.

*app.controller.ts*
```TypeScript
import { Config, dependency, Get } from '@foal/core';

export class AppController {
  @dependency
  config: Config;

  @Get('/')
  get() {
    const secret = this.config.get<string>('secret');
    // Do something with the secret
  }

}
```

*app.controller.spec.ts*
```typescript
import { createController, ConfigMock } from '@foal/core';

import { AppController } from './app.controller';

...
const config = new ConfigMock();
config.set('secret', 'fake_secret');
const controller = createController(AppController, { config });
...

```

The `ConfigMock` is a class to mock the configuration during testing. Here is its signature:

```typescript
interface {
  set(key: string, value: any): void;
  reset(): void;
  get<T = any>(key: string, defaultValue?: T): T;
}
```

## Additional Resources

You might be interested in reading the chapter [III. Config](https://12factor.net/config) of the Twelve-Factor App guide.
