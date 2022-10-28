---
title: New Configuration System
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## The `Config.get` Method

The legacy `Config.get` method has been removed and the `Config.get2` method has been renamed to `Config.get`.

If you were still using the old method, update your code as follows:

```typescript
// Version 1
const foobar = Config.get('hello.world');
const debug = Config.get<boolean>('settings.debug');
const port = Config.get('port', 3001);
const port = Config.get<number>('port', 3001);

// Version 2
const foobar = Config.get('hello.world');
const debug = Config.getOrThrow('settings.debug', 'boolean');
const port = Config.get('port', 'number', 3001);
const port = Config.get('port', 'number', 3001);
```

More details can be found [here](../architecture/configuration.md).

## Environment Variables

Environment variables are no longer loaded by default. You must specify them explicitly.

For example, `Config.get('settings.jwt.secret')` will not return the environment variable `SETTINGS_JWT_SECRET` by default. To do this, you must specify it explicitly in a configuration file:

<Tabs
  defaultValue="yaml"
  values={[
    {label: 'YAML', value: 'yaml'},
    {label: 'JSON', value: 'json'},
    {label: 'JS', value: 'js'},
  ]}
>
<TabItem value="yaml">

```yaml
settings:
  jwt:
    secret: env(SETTINGS_JWT_SECRET)
```

</TabItem>
<TabItem value="json">

```json
{
  "settings": {
    "jwt": {
      "secret": "env(SETTINGS_JWT_SECRET)",
    }
  }
}
```

</TabItem>
<TabItem value="js">

```javascript
const { Env } = require('@foal/core');

module.exports = {
  settings: {
    jwt: {
      secret: Env.get('SETTINGS_JWT_SECRET')
    }
  }
}
```

</TabItem>
</Tabs>

## The `Config` and `ConfigMock` services

The `Config` class can no longer be used as a service. You must use its static methods instead. Therefore, the `ConfigMock` class has also been removed.

```typescript
// Before
export class Controller {
  @dependency
  config: Config;

  foo() {
    const foobar = this.config.get('foobar');
  }
}

// After
export class Controller {
  foo() {
    const foobar = Config.get('foobar');
  }
}

```

## New features

### Multiple `.env` files for each environment

Just like the JSON and YAML configuration files, it is now possible to have a separate `.env` file for each environment: `.env.test`, `.env.production`, etc.

The values provided in a `.env.{environment}` file override those defined in the default `.env` file.

### Read an environment variable from `.env`

Environment variables defined in the `.env` file can be accessed through the `Env.get` method.

### Comments and quotes in `.env` files

The `.env` files now support the use of comments and quotes.

```bash
# This a comment
HELLO="hello world"
HELLO='hello world'
```

### JS configuration files

In addition to the JSON and YAML formats, configuration files can now also be written in JS.

```javascript
const { Env } = require('@foal/core');

module.exports = {
  settings: {
    debug: false,
    jwt: {
      secret: Env.get('SETTINGS_JWT_SECRET')
    }
  }
}
```

### Cloud PaaS providers

Since the configuration keys are no longer linked to a specific environment variable, deployment with PaaS providers is facilitated.

For example, in version 1, the URI of MongoDB had to be passed with the environment variable `MONGODB_URI`. If the cloud provider were giving the URI using the name `MONGO_URI`, things were becoming more difficult. This problem is now solved with the `env(*)` and `Env.get` features.
