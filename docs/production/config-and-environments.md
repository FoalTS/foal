# Config and environments
// Add a little get-started (some code or a cli command)
Configuration should be strictly separated from the codebase. Thus storing credentials or other values varying between deploys is not allowed in FoalTS. Instead a static class `Config` is provided to read config values from separate config files or environment variables.

Let's take an example:

```typescript
const password = Config.get('database', 'strongPassword', 'xxx');
```

FoalTS fetches the password in this order:
- If there is a env variable called `DATABASE_STRONG_PASSWORD` then its value is returned.
- If the file `config/database.[env].json` exists (with `env === process.env.NODE_ENV`) then the value of the property `strongPassword` is returned.
- If the file `config/database.json` exists then the value of the property `strongPassword` is returned.
- Else `'xxx'` is returned.

> If the value of an env variable can be converted to a number or a boolean then it is converted.
