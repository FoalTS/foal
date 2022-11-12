---
title: Server-Side Rendering
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Regular Templates

Regular Web Applications rely on _templates_ to dynamically generate HTML pages on the server. These templates are text files that contain static content as well as a special syntax describing how the data should be inserted dynamically. During an HTTP request, the application loads and renders the template using the given contextual data and sends back the page to the client.

This technique is known as _Server-Side Rendering (or SSR)_.

Here is an example of what a template might look like:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{% title %}</title>
</head>
<body>
  {% for user in users %}
    * {{ user.name }}
  {% else %}
      No users have been found.
  {% endfor %}
</body>
</html>
```

### Rendering Templates

FoalTS provides a minimalist template engine to render templates. This engine replaces all the occurrences of `{{ myVariableName }}` with the given values.

Here is an example showing how to use it:

*templates/index.html*
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{{ title }}</title>
</head>
<body>
  Hello {{ name }}!
</body>
</html>
```

*src/app/app.controller.ts*
```typescript
import { Get, render } from '@foal/core';

export class AppController {
  @Get('/')
  index() {
    return render('./templates/index.html', {
      name: 'Alix',
      title: 'Home'
    });
  }
}
```

*Output (GET /)*
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Home</title>
</head>
<body>
  Hello Alix!
</body>
</html>
```

### Using Another Template Engine

External template engines, such as [EJS](https://www.npmjs.com/package/ejs) or [pug](https://www.npmjs.com/package/pug), are also supported and can be configured for the current project using the configuration key `settings.templateEngine`.

Here is an example showing how to configure `config/default.json` (or `config/default.yml`) with [twig](https://www.npmjs.com/package/twig), a JS implementation of the Twig PHP templating language.

```
npm install twig
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
  templateEngine: twig
```

</TabItem>
<TabItem value="json">

```json
{
  "settings": {
    "templateEngine": "twig"
  }
}
```

</TabItem>
<TabItem value="js">

```javascript
module.exports = {
  settings: {
    templateEngine: "twig"
  }
}
```

</TabItem>
</Tabs>

Then the `render` function uses this engine under the hood to render the templates.

> Note: Only [Express compatible](https://expressjs.com/en/resources/template-engines.html) template engines are supported (which represents the large majority of those available on npm).

*templates/index.html (Twig example)*
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Users</title>
</head>
<body>
  <ul>
    {% for user in users %}
      <li>{{ user.name }}</li>
    {% endfor %}
  </ul>
</body>
</html>
```

*src/app/app.controller.ts (Twig example)*
```typescript
import { Get } from '@foal/core';

export class AppController {
  @Get('/')
  index() {
    return render('./templates/index.html', {
      users: [
        { name: 'John' },
        { name: 'Mary' }
      ]
    });
  }
}
```

*Output (GET /) (Twig example)*
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Users</title>
</head>
<body>
  <ul>
    <li>John</li>
    <li>Mary</li>
  </ul>
</body>
</html>
```

### Path Resolution

By default, the `render` function loads templates from the project root directory.

```typescript
// |- config
// |- src
// '- templates
//   '- login.html
render('./templates/login.html', { /* ... */ })
```

But the path can also be relative to the controller file. The `render` function accepts a third parameter `dirname` for this purpose.

```typescript
/* login.controller.ts */

// |- config
// '- src
//   '- app
//     '- controllers
//       |- templates
//       | '- login.html
//       '- login.controller.ts
render('./templates/login.html', { /* ... */ }, __dirname)
```

## JSX Server-Side Rendering

To compile JSX files, you need to update the `tsconfig.json` as follows:

```json
{
  "compilerOptions": {
    ...
    "jsx": "react",
  },
  "include": [
    "src/**/*.ts"
    "src/**/*.tsx"
  ]
}

```

Then, add the file extension `tsx` in every `tsconfig.*.json`.

*Example with `tsconfig.app.json`*
```json
{
  "extends": "./tsconfig.json",
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx"
  ],
  "exclude": [
    "src/e2e/*.ts",
    "src/**/*.spec.ts",
    "src/e2e.ts",
    "src/test.ts"
  ]
}
```

Every file using JSX must now have the extension `.tsx`.

### Example with React

```
npm install react react-dom
```

This example shows how to use JSX SSR with React. It assumes that `templates` directory is in the root, next to `src`.

*view.controller.tsx*
```typescript
import { Get, render } from '@foal/core';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';

export class ViewController {

  @Get('/')
  async index() {
    const content = ReactDOMServer.renderToString(<div>Hello world!</div>);

    return render('./templates/index.html', {
      content,
    });
  }

}

```

*./templates/index.html*
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Home</title>
</head>
<body>
  {{ content }}
</body>
</html>
```
