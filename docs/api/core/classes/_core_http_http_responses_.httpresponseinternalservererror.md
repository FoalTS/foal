[@foal/core](../README.md) > ["core/http/http-responses"](../modules/_core_http_http_responses_.md) > [HttpResponseInternalServerError](../classes/_core_http_http_responses_.httpresponseinternalservererror.md)

# Class: HttpResponseInternalServerError

Represent an HTTP response with the status 500 - INTERNAL SERVER ERROR.

*__export__*: 

*__class__*: HttpResponseInternalServerError

*__extends__*: {HttpResponseServerError}

## Hierarchy

↳  [HttpResponseServerError](_core_http_http_responses_.httpresponseservererror.md)

**↳ HttpResponseInternalServerError**

## Index

### Constructors

* [constructor](_core_http_http_responses_.httpresponseinternalservererror.md#constructor)

### Properties

* [body](_core_http_http_responses_.httpresponseinternalservererror.md#body)
* [isHttpResponse](_core_http_http_responses_.httpresponseinternalservererror.md#ishttpresponse)
* [isHttpResponseInternalServerError](_core_http_http_responses_.httpresponseinternalservererror.md#ishttpresponseinternalservererror)
* [isHttpResponseServerError](_core_http_http_responses_.httpresponseinternalservererror.md#ishttpresponseservererror)
* [statusCode](_core_http_http_responses_.httpresponseinternalservererror.md#statuscode)
* [statusMessage](_core_http_http_responses_.httpresponseinternalservererror.md#statusmessage)
* [stream](_core_http_http_responses_.httpresponseinternalservererror.md#stream)

### Methods

* [getCookie](_core_http_http_responses_.httpresponseinternalservererror.md#getcookie)
* [getCookies](_core_http_http_responses_.httpresponseinternalservererror.md#getcookies)
* [getHeader](_core_http_http_responses_.httpresponseinternalservererror.md#getheader)
* [getHeaders](_core_http_http_responses_.httpresponseinternalservererror.md#getheaders)
* [setCookie](_core_http_http_responses_.httpresponseinternalservererror.md#setcookie)
* [setHeader](_core_http_http_responses_.httpresponseinternalservererror.md#setheader)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new HttpResponseInternalServerError**(body?: *`any`*, options?: *`object`*): [HttpResponseInternalServerError](_core_http_http_responses_.httpresponseinternalservererror.md)

*Overrides [HttpResponseServerError](_core_http_http_responses_.httpresponseservererror.md).[constructor](_core_http_http_responses_.httpresponseservererror.md#constructor)*

*Defined in [core/http/http-responses.ts:917](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/core/http/http-responses.ts#L917)*

Create an instance of HttpResponseInternalServerError.

*__memberof__*: HttpResponseInternalServerError

**Parameters:**

**`Optional` body: `any`**

**`Default value` options: `object`**

| Name | Type |
| ------ | ------ |
| `Optional` stream | `undefined` \| `false` \| `true` |

**Returns:** [HttpResponseInternalServerError](_core_http_http_responses_.httpresponseinternalservererror.md)

___

## Properties

<a id="body"></a>

### `<Optional>` body

**● body**: *`any`*

*Inherited from [HttpResponse](_core_http_http_responses_.httpresponse.md).[body](_core_http_http_responses_.httpresponse.md#body)*

*Defined in [core/http/http-responses.ts:75](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/core/http/http-responses.ts#L75)*

___
<a id="ishttpresponse"></a>

###  isHttpResponse

**● isHttpResponse**: *`true`* = true

*Inherited from [HttpResponse](_core_http_http_responses_.httpresponse.md).[isHttpResponse](_core_http_http_responses_.httpresponse.md#ishttpresponse)*

*Defined in [core/http/http-responses.ts:40](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/core/http/http-responses.ts#L40)*

Property used internally by isHttpResponse.

*__memberof__*: HttpResponse

___
<a id="ishttpresponseinternalservererror"></a>

###  isHttpResponseInternalServerError

**● isHttpResponseInternalServerError**: *`true`* = true

*Defined in [core/http/http-responses.ts:915](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/core/http/http-responses.ts#L915)*

Property used internally by isHttpResponseInternalServerError.

*__memberof__*: HttpResponseInternalServerError

___
<a id="ishttpresponseservererror"></a>

###  isHttpResponseServerError

**● isHttpResponseServerError**: *`true`* = true

*Inherited from [HttpResponseServerError](_core_http_http_responses_.httpresponseservererror.md).[isHttpResponseServerError](_core_http_http_responses_.httpresponseservererror.md#ishttpresponseservererror)*

*Defined in [core/http/http-responses.ts:877](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/core/http/http-responses.ts#L877)*

Property used internally by isHttpResponseServerError.

*__memberof__*: HttpResponseServerError

___
<a id="statuscode"></a>

###  statusCode

**● statusCode**: *`number`* = 500

*Overrides [HttpResponse](_core_http_http_responses_.httpresponse.md).[statusCode](_core_http_http_responses_.httpresponse.md#statuscode)*

*Defined in [core/http/http-responses.ts:916](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/core/http/http-responses.ts#L916)*

___
<a id="statusmessage"></a>

###  statusMessage

**● statusMessage**: *`string`* = "INTERNAL SERVER ERROR"

*Overrides [HttpResponse](_core_http_http_responses_.httpresponse.md).[statusMessage](_core_http_http_responses_.httpresponse.md#statusmessage)*

*Defined in [core/http/http-responses.ts:917](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/core/http/http-responses.ts#L917)*

___
<a id="stream"></a>

###  stream

**● stream**: *`boolean`* = false

*Inherited from [HttpResponse](_core_http_http_responses_.httpresponse.md).[stream](_core_http_http_responses_.httpresponse.md#stream)*

*Defined in [core/http/http-responses.ts:65](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/core/http/http-responses.ts#L65)*

Specify if the body property is a stream.

*__type__*: {boolean}

*__memberof__*: HttpResponse

___

## Methods

<a id="getcookie"></a>

###  getCookie

▸ **getCookie**(name: *`string`*): `object`

*Inherited from [HttpResponse](_core_http_http_responses_.httpresponse.md).[getCookie](_core_http_http_responses_.httpresponse.md#getcookie)*

*Defined in [core/http/http-responses.ts:132](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/core/http/http-responses.ts#L132)*

Read the value and directives of a cookie added with setCookie.

*__memberof__*: HttpResponse

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| name | `string` |  The cookie name. |

**Returns:** `object`
)} The cookie value and directives
or undefined and an empty object if the cookie does not exist.

___
<a id="getcookies"></a>

###  getCookies

▸ **getCookies**(): `object`

*Inherited from [HttpResponse](_core_http_http_responses_.httpresponse.md).[getCookies](_core_http_http_responses_.httpresponse.md#getcookies)*

*Defined in [core/http/http-responses.ts:147](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/core/http/http-responses.ts#L147)*

Read all the cookies added with setCookie.

*__memberof__*: HttpResponse

**Returns:** `object`
})}
The name, value and directives of the cookies.

___
<a id="getheader"></a>

###  getHeader

▸ **getHeader**(name: *`string`*): `string` \| `undefined`

*Inherited from [HttpResponse](_core_http_http_responses_.httpresponse.md).[getHeader](_core_http_http_responses_.httpresponse.md#getheader)*

*Defined in [core/http/http-responses.ts:98](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/core/http/http-responses.ts#L98)*

Read the value of a header added with setHeader.

*__memberof__*: HttpResponse

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| name | `string` |  The header name. |

**Returns:** `string` \| `undefined`
The header value or undefined if it
does not exist.

___
<a id="getheaders"></a>

###  getHeaders

▸ **getHeaders**(): `object`

*Inherited from [HttpResponse](_core_http_http_responses_.httpresponse.md).[getHeaders](_core_http_http_responses_.httpresponse.md#getheaders)*

*Defined in [core/http/http-responses.ts:108](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/core/http/http-responses.ts#L108)*

Read all the headers added with setHeader.

*__memberof__*: HttpResponse

**Returns:** `object`
- The headers.

___
<a id="setcookie"></a>

###  setCookie

▸ **setCookie**(name: *`string`*, value: *`string`*, options?: *[CookieOptions](../interfaces/_core_http_http_responses_.cookieoptions.md)*): `void`

*Inherited from [HttpResponse](_core_http_http_responses_.httpresponse.md).[setCookie](_core_http_http_responses_.httpresponse.md#setcookie)*

*Defined in [core/http/http-responses.ts:120](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/core/http/http-responses.ts#L120)*

Add or replace a cookie in the response.

*__memberof__*: HttpResponse

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| name | `string` | - |  The cookie name. |
| value | `string` | - |  The cookie value. |
| `Default value` options | [CookieOptions](../interfaces/_core_http_http_responses_.cookieoptions.md) |  {} |

**Returns:** `void`

___
<a id="setheader"></a>

###  setHeader

▸ **setHeader**(name: *`string`*, value: *`string`*): `void`

*Inherited from [HttpResponse](_core_http_http_responses_.httpresponse.md).[setHeader](_core_http_http_responses_.httpresponse.md#setheader)*

*Defined in [core/http/http-responses.ts:86](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/core/http/http-responses.ts#L86)*

Add or replace a header in the response.

*__memberof__*: HttpResponse

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| name | `string` |  The header name. |
| value | `string` |  The value name. |

**Returns:** `void`

___

