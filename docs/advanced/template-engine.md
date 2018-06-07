# Template engine

FoalTS comes up with several tools to render templates.

## `render(template: string, locals?: object): HttpResponseOK`

Renders the template with the given locals and then returns an `HttpResponeOK` whose content is the rendered template.

## `view(path: string, template: string, locals?: object|((ctx: Context) => object)): Controller<'main'>`

Creates a controller that handles requests at GET ${path} and returns a 200 status with the rendered template.

Locals may be an object or a function executed when processing the request.

## Use a different template engine.

By default FoalTS uses [ejs](http://ejs.co/) as template engine but you can use a different one.

To do so, you need to create a package that exports a function `renderToString(template: string, locals?: object): string` and then add your package name in `config/settings.js` as follows:

```json
{
  ...
  "templateEngine": "my-package-name"
  ...
}
```