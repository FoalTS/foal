[@foal/core](../README.md) > ["core/http/http-responses"](../modules/_core_http_http_responses_.md) > [HttpResponseSuccess](../classes/_core_http_http_responses_.httpresponsesuccess.md)

# Class: HttpResponseSuccess

Represent an HTTP response with a success status 2xx.

*__export__*: 

*__abstract__*: 

*__class__*: HttpResponseSuccess

*__extends__*: {HttpResponse}

## Hierarchy

 [HttpResponse](_core_http_http_responses_.httpresponse.md)

**↳ HttpResponseSuccess**

↳  [HttpResponseOK](_core_http_http_responses_.httpresponseok.md)

↳  [HttpResponseCreated](_core_http_http_responses_.httpresponsecreated.md)

↳  [HttpResponseNoContent](_core_http_http_responses_.httpresponsenocontent.md)

## Index

### Constructors

* [constructor](_core_http_http_responses_.httpresponsesuccess.md#constructor)

### Properties

* [body](_core_http_http_responses_.httpresponsesuccess.md#body)
* [isHttpResponse](_core_http_http_responses_.httpresponsesuccess.md#ishttpresponse)
* [isHttpResponseSuccess](_core_http_http_responses_.httpresponsesuccess.md#ishttpresponsesuccess)
* [statusCode](_core_http_http_responses_.httpresponsesuccess.md#statuscode)
* [statusMessage](_core_http_http_responses_.httpresponsesuccess.md#statusmessage)
* [stream](_core_http_http_responses_.httpresponsesuccess.md#stream)

### Methods

* [getCookie](_core_http_http_responses_.httpresponsesuccess.md#getcookie)
* [getCookies](_core_http_http_responses_.httpresponsesuccess.md#getcookies)
* [getHeader](_core_http_http_responses_.httpresponsesuccess.md#getheader)
* [getHeaders](_core_http_http_responses_.httpresponsesuccess.md#getheaders)
* [setCookie](_core_http_http_responses_.httpresponsesuccess.md#setcookie)
* [setHeader](_core_http_http_responses_.httpresponsesuccess.md#setheader)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new HttpResponseSuccess**(body?: *`any`*, options?: *`object`*): [HttpResponseSuccess](_core_http_http_responses_.httpresponsesuccess.md)

*Overrides [HttpResponse](_core_http_http_responses_.httpresponse.md).[constructor](_core_http_http_responses_.httpresponse.md#constructor)*

*Defined in [core/http/http-responses.ts:198](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/core/http/http-responses.ts#L198)*

Create an instance of HttpResponseSuccess.

*__memberof__*: HttpResponseSuccess

**Parameters:**

**`Optional` body: `any`**

**`Default value` options: `object`**

| Name | Type |
| ------ | ------ |
| `Optional` stream | `undefined` \| `false` \| `true` |

**Returns:** [HttpResponseSuccess](_core_http_http_responses_.httpresponsesuccess.md)

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
<a id="ishttpresponsesuccess"></a>

###  isHttpResponseSuccess

**● isHttpResponseSuccess**: *`true`* = true

*Defined in [core/http/http-responses.ts:198](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/core/http/http-responses.ts#L198)*

Property used internally by isHttpResponseSuccess.

*__memberof__*: HttpResponseSuccess

___
<a id="statuscode"></a>

### `<Abstract>` statusCode

**● statusCode**: *`number`*

*Inherited from [HttpResponse](_core_http_http_responses_.httpresponse.md).[statusCode](_core_http_http_responses_.httpresponse.md#statuscode)*

*Defined in [core/http/http-responses.ts:51](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/core/http/http-responses.ts#L51)*

Status code of the response.

*__abstract__*: 

*__type__*: {number}

*__memberof__*: HttpResponse

___
<a id="statusmessage"></a>

### `<Abstract>` statusMessage

**● statusMessage**: *`string`*

*Inherited from [HttpResponse](_core_http_http_responses_.httpresponse.md).[statusMessage](_core_http_http_responses_.httpresponse.md#statusmessage)*

*Defined in [core/http/http-responses.ts:60](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/core/http/http-responses.ts#L60)*

Status message of the response. It must follow the HTTP conventions and be consistent with the statusCode property.

*__abstract__*: 

*__type__*: {string}

*__memberof__*: HttpResponse

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

