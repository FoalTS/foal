# Templating

FoalTS comes up with several tools to render templates.

## `render(templatePath: string, locals: object, dirname: string): Promise<HttpResponseOK>`

Renders the template with the given locals and then resolves an `HttpResponseOK` whose body is the rendered template.

Example:
```typescript
render('./templates/my-template.html', { title: 'foobar' }, __dirname);
```

## Using a different template engine

By default FoalTS uses [ejs](http://ejs.co/) as template engine but you can use a different one.

To do so, you need to create a package that exports a function `renderToString(template: string, locals: object): string` and then to add your package name in `config/default.js` as follows:

```json
{
  ...
  "settings": {
    "templateEngine": "my-package-name"
  }
  ...
}
```
