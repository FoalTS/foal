# Template engine

FoalTS comes up with several tools to render templates.

## `render(template: string, locals?: object): HttpResponseOK`

Renders the template with the given locals and then returns an `HttpResponeOK` whose content is the rendered template.

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
