[@foal/core](../README.md) > ["common/utils/render.util"](../modules/_common_utils_render_util_.md)

# External module: "common/utils/render.util"

## Index

### Functions

* [render](_common_utils_render_util_.md#render)
* [renderToString](_common_utils_render_util_.md#rendertostring)

---

## Functions

<a id="render"></a>

###  render

▸ **render**(templatePath: *`string`*, locals?: *`object`*, dirname?: *`undefined` \| `string`*): `Promise`<[HttpResponseOK](../classes/_core_http_http_responses_.httpresponseok.md)>

*Defined in [common/utils/render.util.ts:40](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/common/utils/render.util.ts#L40)*

Render a template in a new HttpResponseOK object.

The template engine is specified using the configuration key `settings.templateEngine`.

*__export__*: 

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| templatePath | `string` | - |  The path of the template. |
| `Default value` locals | `object` |  {} |  The variables used to render the template. |
| `Optional` dirname | `undefined` \| `string` | - |

**Returns:** `Promise`<[HttpResponseOK](../classes/_core_http_http_responses_.httpresponseok.md)>

___
<a id="rendertostring"></a>

###  renderToString

▸ **renderToString**(template: *`string`*, locals: *`object`*): `string`

*Defined in [common/utils/render.util.ts:19](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/common/utils/render.util.ts#L19)*

Util function to render a template. Minimalist built-in template engine for FoalTS.

renderToString('Hello {{ name }}!', { name: 'Mary' }) returns 'Hello Mary!'

*__export__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| template | `string` |  The template. |
| locals | `object` |  The variables required by the template. |

**Returns:** `string`
The rendered template.

___

