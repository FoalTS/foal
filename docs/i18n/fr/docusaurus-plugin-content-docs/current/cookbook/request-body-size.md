---
title: Taille du Corps de Requête
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

> You are reading the documentation for version 2 of FoalTS. Instructions for upgrading to this version are available [here](../upgrade-to-v2/README.md). The old documentation can be found [here](https://foalts.org/docs/1.x/).

By default, FoalTS only accepts request bodies lower than 100kb. This value can be increased by using the configuration key `settings.bodyParser.limit`. If a number is provided, then the value specifies the number of bytes. If it is a string, the value is passed to the [bytes](https://www.npmjs.com/package/bytes) library for parsing.

<Tabs
  groupId="config"
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
  bodyParser:
    limit: 50mb
```

</TabItem>
<TabItem value="json">

```json
{
  "settings": {
    "bodyParser": {
      "limit": "50mb"
    }
  }
}
```

</TabItem>
<TabItem value="js">

```javascript
module.exports = {
  settings: {
    bodyParser: {
      limit: "50mb"
    }
  }
}
```

</TabItem>
</Tabs>
