# Template Engine

Starting from version 2, only Express-compatible template engines are supported ([EJS](https://www.npmjs.com/package/ejs), [pug](https://www.npmjs.com/package/pug), [Jade](https://www.npmjs.com/package/jade), [Twig](https://www.npmjs.com/package/twig), etc).

## The `@foal/ejs` package

Therefore the package `@foal/ejs` has been removed. If you used it, update your configuration file as follows:

```
npm uninstall @foal/ejs
npm install ejs
```

*Version 1*

{% code-tabs %}
{% code-tabs-item title="YAML" %}
```yaml
settings:
  templateEngine: '@foal/ejs'
```
{% endcode-tabs-item %}
{% code-tabs-item title="JSON" %}
```json
{
  "settings": {
    "templateEngine": "@foal/ejs"
  }
}
```
{% endcode-tabs-item %}
{% code-tabs-item title="JS" %}
```javascript
module.exports = {
  settings: {
    templateEngine: "@foal/ejs"
  }
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

*Version 2*

{% code-tabs %}
{% code-tabs-item title="YAML" %}
```yaml
settings:
  templateEngine: ejs
```
{% endcode-tabs-item %}
{% code-tabs-item title="JSON" %}
```json
{
  "settings": {
    "templateEngine": "ejs"
  }
}
```
{% endcode-tabs-item %}
{% code-tabs-item title="JS" %}
```javascript
module.exports = {
  settings: {
    templateEngine: "ejs"
  }
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}