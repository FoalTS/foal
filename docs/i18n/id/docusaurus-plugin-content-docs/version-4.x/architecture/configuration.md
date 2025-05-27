---
title: Configuration
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


In FoalTS, _configuration_ refers to any parameter that may vary between deploy environments (production, development, test, etc). It includes sensitive information, such as your database credentials, or simple settings, such as the server port.

The framework encourages a **strict separation between configuration and code** and allows you to define your configuration in environment variables, in `.env` files and in files in the `config/` directory.

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

## Configuration Files

Configuration values are provided using configuration files in the `config/` directory. Several formats are supported: YAML, JSON and JS files.

*config/default.\{yml|json|js\}*

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
  session:
    store: "@foal/typeorm"
```

</TabItem>
<TabItem value="json">

```json
{
  "settings": {
    "session": {
      "store": "@foal/typeorm"
    }
  }
}
```

</TabItem>
<TabItem value="js">

```javascript
module.exports = {
  settings: {
    session: {
      store: "@foal/typeorm"
    }
  }
}
```

</TabItem>
</Tabs>

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

### Deployment Environments

The *default* configuration files are used regardless of the environment, i.e. regardless of the value assigned to the `NODE_ENV` environment variable.

Configuration values can also be set or overridden for a specific environment using the filename syntax: `config/<environment-name>.{json|yml|js}`. If no value is assigned to `NODE_ENV`, the environment considered is *development*.

> The environment name can be provided in two ways in Foal: via the `NODE_ENV` environment variable or via `FOAL_ENV`. If both of these variables are set, then the value of `FOAL_ENV` is used by the configuration system.

### Reserved Parameters

All parameters under the keyword `settings` are reserved for the operation of the framework. You can assign values to those given in the documentation, but you cannot create new ones.

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
  session:
    store: "@foal/typeorm"

customConfiguration:
  message: hello world
```

</TabItem>
<TabItem value="json">

```json
{
  "settings": {
    "session": {
      "store": "@foal/typeorm"
    }
  },
  "customConfiguration": {
    "message": "hello world"
  }
}
```

</TabItem>
<TabItem value="js">

```javascript
module.exports = {
  settings: {
    session: {
      store: "@foal/typeorm"
    }
  },
  customConfiguration: {
    message: "hello world"
  }
}
```

</TabItem>
</Tabs>

## Accessing Configuration Values

The `Config` class provides two static methods `get` and `getOrThrow` for reading configuration values.

### The `Config.get` method

This function takes the configuration key as first parameter.

```typescript
import { Config } from '@foal/core';

const secret = Config.get('settings.jwt.secret');
```

The algorithm below is used to retrieve the configuration value:
1. Return the value specified in the environment config file if it exists.
2. Return the value specified in the *default* config file it is exists.
3. Return `undefined` otherwise.

#### Specifying a type

The method also accepts a second optional parameter to define the type of the returned value.

```typescript
import { Config } from '@foal/core';

const foobar = Config.get('settings.foobar', 'boolean|string');
// foobar is of type boolean|string|undefined
```

When it is set, Foal checks that the configuration value has the correct type and if it does not, it will try to convert it to the desired type (e.g. `"true"` becomes `true`). If it does not succeed, a `ConfigTypeError` is thrown.

| Allowed types |
| --- |
| string |
| number |
| boolean |
| boolean\|string |
| number\|string |
| any |

#### Specifying a default value

The third optional parameter of the method allows you to define a default value if none is found in the configuration.

```typescript
const foobar = Config.get('settings.foobar', 'boolean', false);
// foobar is of type boolean
```

### The `Config.getOrThrow` method

```typescript
const foobar = Config.getOrThrow('settings.foobar', 'boolean');
// foobar is of type boolean
```

This method has the same behavior as `Config.get` except that it does not accept a default value. If no value is found, the method will throw a `ConfigNotFoundError`.

## Environment Variables and `.env` Files

Configuration files in the `config/` directory are usually committed and therefore should not contain sensitive information (such as database credentials).

The recommended approach to provide sensitive information to the application is to use environment variables and `.env` files which are not committed. Then, in the configuration files, the values are retrieved.

*.env*
```
JWT_SECRET="Ak0WcVcGuOoFuZ4oqF1tgqbW6dIAeSacIN6h7qEyJM8="
```

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
    secret: env(JWT_SECRET)
    secretEncoding: base64
```

</TabItem>
<TabItem value="json">

```json
{
  "settings": {
    "jwt": {
      "secret": "env(JWT_SECRET)",
      "secretEncoding": "base64"
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
      secret: Env.get('JWT_SECRET'),
      secretEncoding: 'base64'
    }
  }
}
```

</TabItem>
</Tabs>

If the same variable is provided both as environment variable and in the `.env` file, then the value of the environment variable is used.

### Deployment Environments

Just like the configuration files in the `config/` directory, the `.env` files can be used for several environments: `.env.production`, `.env.test`, etc.

### Using `*.local` files

In case you want to have two `.env` files, one to define the default env vars needed by the application and another to override these values on your local machine, you can use a `.env.local` file.

If a variable is defined in both files, the value in the `.env.local` file will take precedence.

Similarly, you can define environment-specific local files (`.env.development.local`, `.env.production.local`, etc).

### Note on the use of dotenv

Many NodeJS applications use the [dotenv](https://www.npmjs.com/package/dotenv) library to manage the environment configuration. It loads variables from the `.env` file if it exists and assigns their values to the `process.env` object.

When using Foal, it is strongly recommended that you do not use this library as it may break some functionality. For example, you will not be able to use other files such as `.env.production` and `.env.local`.

The recommended approach to loading environment variables from `.env` files is to use Foal's configuration system using the `Config` or `Env` class.

*Example*
```typescript
// dotenv
const value = process.env.FOO_BAR;

// Foal
import { Env } from '@foal/core';

const value = Env.get('FOO_BAR');
```