[@foal/core](../README.md) > ["core/http/http-responses"](../modules/_core_http_http_responses_.md) > [HttpResponseNotImplemented](../classes/_core_http_http_responses_.httpresponsenotimplemented.md)

# Class: HttpResponseNotImplemented

Represent an HTTP response with the status 501 - NOT IMPLEMENTED.

*__export__*: 

*__class__*: HttpResponseNotImplemented

*__extends__*: {HttpResponseServerError}

## Hierarchy

↳  [HttpResponseServerError](_core_http_http_responses_.httpresponseservererror.md)

**↳ HttpResponseNotImplemented**

## Index

### Constructors

* [constructor](_core_http_http_responses_.httpresponsenotimplemented.md#constructor)

### Properties

* [body](_core_http_http_responses_.httpresponsenotimplemented.md#body)
* [isHttpResponse](_core_http_http_responses_.httpresponsenotimplemented.md#ishttpresponse)
* [isHttpResponseNotImplemented](_core_http_http_responses_.httpresponsenotimplemented.md#ishttpresponsenotimplemented)
* [isHttpResponseServerError](_core_http_http_responses_.httpresponsenotimplemented.md#ishttpresponseservererror)
* [statusCode](_core_http_http_responses_.httpresponsenotimplemented.md#statuscode)
* [statusMessage](_core_http_http_responses_.httpresponsenotimplemented.md#statusmessage)
* [stream](_core_http_http_responses_.httpresponsenotimplemented.md#stream)

### Methods

* [getCookie](_core_http_http_responses_.httpresponsenotimplemented.md#getcookie)
* [getCookies](_core_http_http_responses_.httpresponsenotimplemented.md#getcookies)
* [getHeader](_core_http_http_responses_.httpresponsenotimplemented.md#getheader)
* [getHeaders](_core_http_http_responses_.httpresponsenotimplemented.md#getheaders)
* [setCookie](_core_http_http_responses_.httpresponsenotimplemented.md#setcookie)
* [setHeader](_core_http_http_responses_.httpresponsenotimplemented.md#setheader)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new HttpResponseNotImplemented**(body?: *`any`*, options?: *`object`*): [HttpResponseNotImplemented](_core_http_http_responses_.httpresponsenotimplemented.md)

*Overrides [HttpResponseServerError](_core_http_http_responses_.httpresponseservererror.md).[constructor](_core_http_http_responses_.httpresponseservererror.md#constructor)*

*Defined in [core/http/http-responses.ts:970](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/core/http/http-responses.ts#L970)*

Create an instance of HttpResponseNotImplemented.

*__memberof__*: HttpResponseNotImplemented

**Parameters:**

**`Optional` body: `any`**

**`Default value` options: `object`**

| Name | Type |
| ------ | ------ |
| `Optional` stream | `undefined` \| `false` \| `true` |

**Returns:** [HttpResponseNotImplemented](_core_http_http_responses_.httpresponsenotimplemented.md)

___

## Properties

<a id="body"></a>

### `<Optional>` body

**● body**: *`any`*

*Inherited from [HttpResponse](_core_http_http_responses_.httpresponse.md).[body](_core_http_http_responses_.httpresponse.md#body)*

*Defined in [core/http/http-responses.ts:77](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/core/http/http-responses.ts#L77)*

___
<a id="ishttpresponse"></a>

###  isHttpResponse

**● isHttpResponse**: *`true`* = true

*Inherited from [HttpResponse](_core_http_http_responses_.httpresponse.md).[isHttpResponse](_core_http_http_responses_.httpresponse.md#ishttpresponse)*

*Defined in [core/http/http-responses.ts:42](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/core/http/http-responses.ts#L42)*

Property used internally by isHttpResponse.

*__memberof__*: HttpResponse

___
<a id="ishttpresponsenotimplemented"></a>

###  isHttpResponseNotImplemented

**● isHttpResponseNotImplemented**: *`true`* = true

*Defined in [core/http/http-responses.ts:968](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/core/http/http-responses.ts#L968)*

Property used internally by isHttpResponseNotImplemented.

*__memberof__*: HttpResponseNotImplemented

___
<a id="ishttpresponseservererror"></a>

###  isHttpResponseServerError

**● isHttpResponseServerError**: *`true`* = true

*Inherited from [HttpResponseServerError](_core_http_http_responses_.httpresponseservererror.md).[isHttpResponseServerError](_core_http_http_responses_.httpresponseservererror.md#ishttpresponseservererror)*

*Defined in [core/http/http-responses.ts:884](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/core/http/http-responses.ts#L884)*

Property used internally by isHttpResponseServerError.

*__memberof__*: HttpResponseServerError

___
<a id="statuscode"></a>

###  statusCode

**● statusCode**: *`number`* = 501

*Overrides [HttpResponse](_core_http_http_responses_.httpresponse.md).[statusCode](_core_http_http_responses_.httpresponse.md#statuscode)*

*Defined in [core/http/http-responses.ts:969](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/core/http/http-responses.ts#L969)*

___
<a id="statusmessage"></a>

###  statusMessage

**● statusMessage**: *`string`* = "NOT IMPLEMENTED"

*Overrides [HttpResponse](_core_http_http_responses_.httpresponse.md).[statusMessage](_core_http_http_responses_.httpresponse.md#statusmessage)*

*Defined in [core/http/http-responses.ts:970](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/core/http/http-responses.ts#L970)*

___
<a id="stream"></a>

###  stream

**● stream**: *`boolean`* = false

*Inherited from [HttpResponse](_core_http_http_responses_.httpresponse.md).[stream](_core_http_http_responses_.httpresponse.md#stream)*

*Defined in [core/http/http-responses.ts:67](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/core/http/http-responses.ts#L67)*

Specify if the body property is a stream.

*__type__*: {boolean}

*__memberof__*: HttpResponse

___

## Methods

<a id="getcookie"></a>

###  getCookie

▸ **getCookie**(name: *`string`*): `object`

*Inherited from [HttpResponse](_core_http_http_responses_.httpresponse.md).[getCookie](_core_http_http_responses_.httpresponse.md#getcookie)*

*Defined in [core/http/http-responses.ts:138](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/core/http/http-responses.ts#L138)*

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

*Defined in [core/http/http-responses.ts:153](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/core/http/http-responses.ts#L153)*

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

*Defined in [core/http/http-responses.ts:102](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/core/http/http-responses.ts#L102)*

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

*Defined in [core/http/http-responses.ts:112](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/core/http/http-responses.ts#L112)*

Read all the headers added with setHeader.

*__memberof__*: HttpResponse

**Returns:** `object`
- The headers.

___
<a id="setcookie"></a>

###  setCookie

▸ **setCookie**(name: *`string`*, value: *`string`*, options?: *[CookieOptions](../interfaces/_core_http_http_responses_.cookieoptions.md)*): `this`

*Inherited from [HttpResponse](_core_http_http_responses_.httpresponse.md).[setCookie](_core_http_http_responses_.httpresponse.md#setcookie)*

*Defined in [core/http/http-responses.ts:125](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/core/http/http-responses.ts#L125)*

Add or replace a cookie in the response.

*__memberof__*: HttpResponse

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| name | `string` | - |  The cookie name. |
| value | `string` | - |  The cookie value. |
| `Default value` options | [CookieOptions](../interfaces/_core_http_http_responses_.cookieoptions.md) |  {} |

**Returns:** `this`

___
<a id="setheader"></a>

###  setHeader

▸ **setHeader**(name: *`string`*, value: *`string`*): `this`

*Inherited from [HttpResponse](_core_http_http_responses_.httpresponse.md).[setHeader](_core_http_http_responses_.httpresponse.md#setheader)*

*Defined in [core/http/http-responses.ts:89](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/core/http/http-responses.ts#L89)*

Add or replace a header in the response.

*__memberof__*: HttpResponse

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| name | `string` |  The header name. |
| value | `string` |  The value name. |

**Returns:** `this`

___

