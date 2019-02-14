# Configuration

> You might be interested in reading the chapter [III. Config](https://12factor.net/config) of the Twelve-Factor App guide.

```
|- config
| |- settings.json
| |- ...
| '- my-other-config-file.json
'- src
```

Configuration should be strictly separated from the codebase. Thus storing in the code credentials or other values varying between deploys is not allowed in FoalTS. Instead a static class `Config` is provided to read config values from separate config files or environment variables.

Let's take an example:

```typescript
const password = Config.get<string>('database.strongPassword', 'xxx');
```

FoalTS fetches the password in this order:
- If there is a env variable called `DATABASE_STRONG_PASSWORD` then its value is returned.
- If the file `config/database.[env].json` exists (with `env === process.env.NODE_ENV`) then the value of the property `strongPassword` is returned.
- If the file `config/database.json` exists then the value of the property `strongPassword` is returned.
- Else `'xxx'` is returned.

> If the value of an env variable can be converted to a number or a boolean then it is converted.
ormconfig.json

configuration can be multi level

## TypeORM configuration

## Using YAML

Install `yamljs`

ormconfig.yml

The createapp --yaml flag

`settings`: configuration from foal official packages. Each sub-section is the name of the package. Exception the PORT

*Example of configuration file:*
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
  uri: 'mongodb://localhost:27017/test'
```