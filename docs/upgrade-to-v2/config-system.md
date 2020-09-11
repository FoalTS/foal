# New Configuration System

## The `Config.get` Method

The legacy `Config.get` method has been removed and the `Config.get2` method has been renamed to `Config.get`.

If you were still using the old method, update your code as follows:

```typescript
// Version 1
const foobar = Config.get('hello.world');
const debug = Config.get<boolean>('settings.debug');
const port = Config.get('port', 3001);

// Version 2
const foobar = Config.get('hello.world');
const debug = Config.get('settings.debug', 'boolean');
const port = Config.get('port', 'number' 3001);
```

More details can be found [here](../deployment-and-environments/configuration.md).

## Environment Variables

Environment variables are no longer loaded by default. You must specify them explicitly.

For example, `Config.get('settings.jwt.secret')` will not return the environment variable `SETTINGS_JWT_SECRET` by default. To do this, you must specify it explicitly in a configuration file:

{% code-tabs %}
{% code-tabs-item title="YAML" %}
```yaml
settings:
  jwt:
    secret: env(SETTINGS_JWT_SECRET)
```
{% endcode-tabs-item %}
{% code-tabs-item title="JSON" %}
```json
{
  "settings": {
    "jwt": {
      "secret": "env(SETTINGS_JWT_SECRET)",
    }
  }
}
```
{% endcode-tabs-item %}
{% code-tabs-item title="JS" %}
```javascript
const { Env } = require('@foal/core');

module.exports =   {
  settings: {
    jwt: {
      secret: Env.get('SETTINGS_JWT_SECRET')
    }
  }
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}