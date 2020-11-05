# Request Body Size

By default, FoalTS only accepts request bodies lower than 100kb. This value can be increased by using the configuration key `settings.bodyParser.limit`. If a number is provided, then the value specifies the number of bytes. If it is a string, the value is passed to the [bytes](https://www.npmjs.com/package/bytes) library for parsing.

{% code-tabs %}
{% code-tabs-item title="YAML" %}
```yaml
settings:
  bodyParser:
    limit: 50mb
```
{% endcode-tabs-item %}
{% code-tabs-item title="JSON" %}
```json
{
  "settings": {
    "bodyParser": {
      "limit": "50mb"
    }
  }
}
```
{% endcode-tabs-item %}
{% code-tabs-item title="JS" %}
```javascript
module.exports = {
  settings: {
    bodyParser: {
      limit: "50mb"
    }
  }
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}
