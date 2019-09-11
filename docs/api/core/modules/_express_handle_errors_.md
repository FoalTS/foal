[@foal/core](../README.md) > ["express/handle-errors"](../modules/_express_handle_errors_.md)

# External module: "express/handle-errors"

## Index

### Variables

* [page500](_express_handle_errors_.md#page500)

### Functions

* [handleErrors](_express_handle_errors_.md#handleerrors)

---

## Variables

<a id="page500"></a>

### `<Const>` page500

**● page500**: *`string`* =  '<html><head><title>INTERNAL SERVER ERROR</title></head><body>'
                + '<h1>500 - INTERNAL SERVER ERROR</h1></body></html>'

*Defined in [express/handle-errors.ts:6](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/express/handle-errors.ts#L6)*

___

## Functions

<a id="handleerrors"></a>

###  handleErrors

▸ **handleErrors**(debug: *`boolean`*, logFn?: *`error`*): `(Anonymous function)`

*Defined in [express/handle-errors.ts:17](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/express/handle-errors.ts#L17)*

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

