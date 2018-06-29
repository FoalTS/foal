# Template engine

FoalTS comes up with several tools to render templates.

## `render(template: string, locals?: object): HttpResponseOK`

Renders the template with the given locals and then returns an `HttpResponeOK` whose content is the rendered template.

## `view(path: string, template: string, locals?: object|((ctx: Context) => object)): Controller<'main'>`

Creates a controller that handles requests at GET ${path} and returns a 200 status with the rendered template.

Locals may be an object or a function executed when processing the request.

## Using a different template engine

By default FoalTS uses [ejs](http://ejs.co/) as template engine but you can use a different one.

To do so, you need to create a package that exports a function `renderToString(template: string, locals?: object): string` and then to add your package name in `config/settings.js` as follows:

```json
{
  ...
  "templateEngine": "my-package-name"
  ...
}
```


## Create a view controller

```typescript
import { view, Module } from '@foal/core';

import { MyAuthenticatorService } from './services/my-authenticator.service';

export const AppModule: Module = {
  controllers: [
    view('/foo', '<html><%= content %></html>', { content: '<body></body>' })
  ]
};
```