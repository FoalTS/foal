[@foal/core](../README.md) > ["express/handle-errors"](../modules/_express_handle_errors_.md)

# External module: "express/handle-errors"

## Index

### Variables

* [page500](_express_handle_errors_.md#page500)

### Functions

* [handleErrors](_express_handle_errors_.md#handleerrors)
* [renderDebug500](_express_handle_errors_.md#renderdebug500)

---

## Variables

<a id="page500"></a>

### `<Const>` page500

**● page500**: *`string`* =  '<html><head><title>INTERNAL SERVER ERROR</title></head><body>'
                + '<h1>500 - INTERNAL SERVER ERROR</h1></body></html>'

*Defined in [express/handle-errors.ts:1](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/express/handle-errors.ts#L1)*

___

## Functions

<a id="handleerrors"></a>

###  handleErrors

▸ **handleErrors**(debug: *`boolean`*, logFn?: *`error`*): `(Anonymous function)`

*Defined in [express/handle-errors.ts:25](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/express/handle-errors.ts#L25)*

Create an express middleware to return a 500 HTML page if an error is thrown and is not caught.

*__export__*: 

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| debug | `boolean` | - |  Specify if the error stack should be included in the page. |
| `Default value` logFn | `error` |  console.error |

**Returns:** `(Anonymous function)`
The express middleware.

___
<a id="renderdebug500"></a>

###  renderDebug500

▸ **renderDebug500**(stack: *`any`*): `string`

*Defined in [express/handle-errors.ts:4](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/express/handle-errors.ts#L4)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| stack | `any` |

**Returns:** `string`

___

