[@foal/core](../README.md) > ["core/http/http-methods"](../modules/_core_http_http_methods_.md)

# External module: "core/http/http-methods"

## Index

### Type aliases

* [HttpMethod](_core_http_http_methods_.md#httpmethod)

### Functions

* [Delete](_core_http_http_methods_.md#delete)
* [Get](_core_http_http_methods_.md#get)
* [Head](_core_http_http_methods_.md#head)
* [Options](_core_http_http_methods_.md#options)
* [Patch](_core_http_http_methods_.md#patch)
* [Post](_core_http_http_methods_.md#post)
* [Put](_core_http_http_methods_.md#put)

---

## Type aliases

<a id="httpmethod"></a>

###  HttpMethod

**Ƭ HttpMethod**: *"POST" \| "GET" \| "PUT" \| "PATCH" \| "DELETE" \| "HEAD" \| "OPTIONS"*

*Defined in [core/http/http-methods.ts:7](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/core/http/http-methods.ts#L7)*

HTTP methods available.

___

## Functions

<a id="delete"></a>

###  Delete

▸ **Delete**(path?: *`undefined` \| `string`*): `(Anonymous function)`

*Defined in [core/http/http-methods.ts:100](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/core/http/http-methods.ts#L100)*

Decorator specifying that a controller method handles DELETE requests.

*__export__*: 

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` path | `undefined` \| `string` |

**Returns:** `(Anonymous function)`
The decorator.

___
<a id="get"></a>

###  Get

▸ **Get**(path?: *`undefined` \| `string`*): `(Anonymous function)`

*Defined in [core/http/http-methods.ts:44](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/core/http/http-methods.ts#L44)*

Decorator specifying that a controller method handles GET requests.

*__export__*: 

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` path | `undefined` \| `string` |

**Returns:** `(Anonymous function)`
The decorator.

___
<a id="head"></a>

###  Head

▸ **Head**(path?: *`undefined` \| `string`*): `(Anonymous function)`

*Defined in [core/http/http-methods.ts:16](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/core/http/http-methods.ts#L16)*

Decorator specifying that a controller method handles HEAD requests.

*__export__*: 

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` path | `undefined` \| `string` |

**Returns:** `(Anonymous function)`
The decorator.

___
<a id="options"></a>

###  Options

▸ **Options**(path?: *`undefined` \| `string`*): `(Anonymous function)`

*Defined in [core/http/http-methods.ts:30](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/core/http/http-methods.ts#L30)*

Decorator specifying that a controller method handles OPTIONS requests.

*__export__*: 

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` path | `undefined` \| `string` |

**Returns:** `(Anonymous function)`
The decorator.

___
<a id="patch"></a>

###  Patch

▸ **Patch**(path?: *`undefined` \| `string`*): `(Anonymous function)`

*Defined in [core/http/http-methods.ts:86](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/core/http/http-methods.ts#L86)*

Decorator specifying that a controller method handles PATCH requests.

*__export__*: 

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` path | `undefined` \| `string` |

**Returns:** `(Anonymous function)`
The decorator.

___
<a id="post"></a>

###  Post

▸ **Post**(path?: *`undefined` \| `string`*): `(Anonymous function)`

*Defined in [core/http/http-methods.ts:58](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/core/http/http-methods.ts#L58)*

Decorator specifying that a controller method handles POST requests.

*__export__*: 

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` path | `undefined` \| `string` |

**Returns:** `(Anonymous function)`
The decorator.

___
<a id="put"></a>

###  Put

▸ **Put**(path?: *`undefined` \| `string`*): `(Anonymous function)`

*Defined in [core/http/http-methods.ts:72](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/core/http/http-methods.ts#L72)*

Decorator specifying that a controller method handles PUT requests.

*__export__*: 

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` path | `undefined` \| `string` |

**Returns:** `(Anonymous function)`
The decorator.

___

