---
title: Request Body Size
---

By default, FoalTS only accepts request bodies lower than 100kb. This value can be increased by using the configuration key `settings.bodyParser.limit`. If a number is provided, then the value specifies the number of bytes. If it is a string, the value is passed to the [bytes](https://www.npmjs.com/package/bytes) library for parsing.

*config/default.yml (example)*
```yaml
settings:
  bodyParser:
    limit: '50mb'
```

*config/default.json (example)*
```json
{
  "settings": {
    "bodyParser": {
      "limit": "50mb"
    }
  }
}
```

*.env (example)*
```
SETTINGS_BODY_PARSER_LIMIT=50mb
```