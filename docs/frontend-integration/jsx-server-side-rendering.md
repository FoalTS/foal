# JSX Server-Side Rendering

> If you are interested in SSR without JSX, then you might take a look at [the "templating" page](../utilities/templating.md).

## Compile JSX Files

The TypeScript compiler supports JSX.

To enable this feature, update the `tsconfig.json` as follows:
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
    "src/app/**/*.ts",
    "src/app/**/*.tsx",
    "src/index.ts"
  ],
  "exclude": [
    "src/app/**/*.spec.ts"
  ]
}
```

Every file using JSX must now have the extension `.tsx`.

## Example with React

```
npm install react react-dom @types/react-dom
```

This example shows how to use JSX SSR with React. It assumes that both `view.controller.tsx` and `template.html` files are in the same directory.

*view.controller.tsx*
```typescript
// std
import { readFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

// 3p
import { Get, HttpResponseOK } from '@foal/core';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';

export class ViewController {

  @Get('/')
  async index() {
    const content = ReactDOMServer.renderToString(<div>Hello world!</div>);
    const page = await this.renderFullPage(content);

    const response = new HttpResponseOK(page);
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    return response;
  }

  private async renderFullPage(content: string): Promise<string> {
    const template = await promisify(readFile)(join(__dirname, 'template.html'), 'utf8');
    return template.replace('{{ content }}', content);
  }

}

```

*template.html*
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
