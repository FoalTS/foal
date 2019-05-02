[@foal/core](../README.md) > ["common/utils/render.util"](../modules/_common_utils_render_util_.md)

# External module: "common/utils/render.util"

## Index

### Functions

* [render](_common_utils_render_util_.md#render)

---

## Functions

<a id="render"></a>

###  render

▸ **render**(templatePath: *`string`*, locals: *`object`*, dirname: *`string`*): [HttpResponseOK](../classes/_core_http_http_responses_.httpresponseok.md)

*Defined in [common/utils/render.util.ts:19](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/common/utils/render.util.ts#L19)*

Render a template in a new HttpResponseOK object.

*__export__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| templatePath | `string` |  The path of the template. |
| locals | `object` |  The variables used to render the template. |
| dirname | `string` |  The directory name where the templated is located. The passed value is usually \`\_\_dirname\`. The function then joins \`dirname\` and \`templatePath\` together. |

**Returns:** [HttpResponseOK](../classes/_core_http_http_responses_.httpresponseok.md)

___

