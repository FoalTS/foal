# Config and environments

Rappel: different envionments. Explain why.

Don't put keys and config in code. Explain why.

What we usually do: put in separate config files or environments variables.

That's why official component do not let you write config in files. Instead they use a static class `Config` to access environment variables and configuration files.

Take a look at the get method and show the supported types.

Explain auto-conversion.

Explain the process :
- first check the variable environments (tell convention camel -> upper snake)
- if not found check `config/name.[env].json`. env is evaluated with the NODE_ENV variable env. Default to development.
- if not found (property or file), check `config/name.json`
- if not return the default value.