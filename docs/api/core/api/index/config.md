# Table of contents

* [Config][ClassDeclaration-22]
    * Methods
        * [get(key, defaultValue)][MethodDeclaration-8]
        * [get(key, defaultValue)][MethodDeclaration-10]
        * [clearCache()][MethodDeclaration-9]

# Config

Static class to access environment variables and configuration files.

This class can also be used as a service.

```typescript
class Config
```
## Methods

### get(key, defaultValue)

Access environment variables and configuration files.

For example, if it is called with the string `settings.session.secret`,
the method will go through these steps:

1. If the environment variable `SETTINGS_SESSION_SECRET` exists, then return its value.
2. If `.env` exists and has a line `SETTINGS_SESSION_SECRET=`, then return its value.
3. If `config/${NODE_ENV}.json` exists and the property `config['settings']['session']['secret']`
does too, then return its value.
4. Same with `config/${NODE_ENV}.yml`.
5. If `config/default.json` exists and the property `config['settings']['session']['secret']`
does too, then return its value.
6. Same with `config/default.yml`.

If none value is found, then the method returns the default value provided as second argument
to the function. If none was given, it returns undefined.

```typescript
public static get<T = any>(key: string, defaultValue?: T | undefined): T;
```

**Type parameters**

| Name | Default |
| ---- | ------- |
| T    | any     |

**Parameters**

| Name         | Type               | Description                                                           |
| ------------ | ------------------ | --------------------------------------------------------------------- |
| key          | string             | - Name of the config key using dots and camel case.                   |
| defaultValue | T &#124; undefined | - Default value to return if no configuration is found with that key. |

**Return type**

T

----------

### get(key, defaultValue)

Access environment variables and configuration files.

For example, if it is called with the string `settings.session.secret`,
the method will go through these steps:

1. If the environment variable `SETTINGS_SESSION_SECRET` exists, then return its value.
2. If `.env` exists and has a line `SETTINGS_SESSION_SECRET=`, then return its value.
3. If `config/${NODE_ENV}.json` exists and the property `config['settings']['session']['secret']`
does too, then return its value.
4. Same with `config/${NODE_ENV}.yml`.
5. If `config/default.json` exists and the property `config['settings']['session']['secret']`
does too, then return its value.
6. Same with `config/default.yml`.

If none value is found, then the method returns the default value provided as second argument
to the function. If none was given, it returns undefined.

```typescript
public get<T = any>(key: string, defaultValue?: T | undefined): T;
```

**Type parameters**

| Name | Default |
| ---- | ------- |
| T    | any     |

**Parameters**

| Name         | Type               | Description                                                           |
| ------------ | ------------------ | --------------------------------------------------------------------- |
| key          | string             | - Name of the config key using dots and camel case.                   |
| defaultValue | T &#124; undefined | - Default value to return if no configuration is found with that key. |

**Return type**

T

----------

### clearCache()

Clear the cache of the loaded files.

```typescript
public static clearCache(): void;
```

**Return type**

void

[ClassDeclaration-22]: config.md#config
[MethodDeclaration-8]: config.md#getkey-defaultvalue
[MethodDeclaration-10]: config.md#getkey-defaultvalue
[MethodDeclaration-9]: config.md#clearcache