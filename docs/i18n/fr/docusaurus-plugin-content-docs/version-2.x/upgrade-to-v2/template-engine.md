---
title: Template Engine
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Starting from version 2, only Express-compatible template engines are supported ([EJS](https://www.npmjs.com/package/ejs), [pug](https://www.npmjs.com/package/pug), [Jade](https://www.npmjs.com/package/jade), [Twig](https://www.npmjs.com/package/twig), etc).

## The `@foal/ejs` package

Therefore the package `@foal/ejs` has been removed. If you used it, update your configuration file as follows:

```
npm uninstall @foal/ejs
npm install ejs
```

*Version 1*

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
  templateEngine: '@foal/ejs'
```

</TabItem>
<TabItem value="json">

```json
{
  "settings": {
    "templateEngine": "@foal/ejs"
  }
}
```

</TabItem>
<TabItem value="js">

```javascript
module.exports = {
  settings: {
    templateEngine: "@foal/ejs"
  }
}
```

</TabItem>
</Tabs>

*Version 2*

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
  templateEngine: ejs
```

</TabItem>
<TabItem value="json">

```json
{
  "settings": {
    "templateEngine": "ejs"
  }
}
```

</TabItem>
<TabItem value="js">

```javascript
module.exports = {
  settings: {
    templateEngine: "ejs"
  }
}
```

</TabItem>
</Tabs>