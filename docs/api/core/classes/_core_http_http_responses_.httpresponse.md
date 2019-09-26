[@foal/core](../README.md) > ["core/http/http-responses"](../modules/_core_http_http_responses_.md) > [HttpResponse](../classes/_core_http_http_responses_.httpresponse.md)

# Class: HttpResponse

Reprensent an HTTP response. This class must be extended. Instances of HttpResponse are returned in hooks and controller methods.

*__export__*: 

*__abstract__*: 

*__class__*: HttpResponse

## Hierarchy

**HttpResponse**

↳  [HttpResponseSuccess](_core_http_http_responses_.httpresponsesuccess.md)

↳  [HttpResponseRedirection](_core_http_http_responses_.httpresponseredirection.md)

↳  [HttpResponseClientError](_core_http_http_responses_.httpresponseclienterror.md)

↳  [HttpResponseServerError](_core_http_http_responses_.httpresponseservererror.md)

## Index

### Constructors

* [constructor](_core_http_http_responses_.httpresponse.md#constructor)

### Properties

* [body](_core_http_http_responses_.httpresponse.md#body)
* [cookies](_core_http_http_responses_.httpresponse.md#cookies)
* [headers](_core_http_http_responses_.httpresponse.md#headers)
* [isHttpResponse](_core_http_http_responses_.httpresponse.md#ishttpresponse)
* [statusCode](_core_http_http_responses_.httpresponse.md#statuscode)
* [statusMessage](_core_http_http_responses_.httpresponse.md#statusmessage)
* [stream](_core_http_http_responses_.httpresponse.md#stream)

### Methods

* [getCookie](_core_http_http_responses_.httpresponse.md#getcookie)
* [getCookies](_core_http_http_responses_.httpresponse.md#getcookies)
* [getHeader](_core_http_http_responses_.httpresponse.md#getheader)
* [getHeaders](_core_http_http_responses_.httpresponse.md#getheaders)
* [setCookie](_core_http_http_responses_.httpresponse.md#setcookie)
* [setHeader](_core_http_http_responses_.httpresponse.md#setheader)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new HttpResponse**(body?: *`any`*, options?: *`object`*): [HttpResponse](_core_http_http_responses_.httpresponse.md)

*Defined in [core/http/http-responses.ts:70](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/core/http/http-responses.ts#L70)*

Create an instance of HttpResponse.

*__memberof__*: HttpResponse

**Parameters:**

**`Optional` body: `any`**

**`Default value` options: `object`**

| Name | Type |
| ------ | ------ |
| `Optional` stream | `undefined` \| `false` \| `true` |

**Returns:** [HttpResponse](_core_http_http_responses_.httpresponse.md)

___

## Properties

<a id="body"></a>

### `<Optional>` body

**● body**: *`any`*

*Defined in [core/http/http-responses.ts:77](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/core/http/http-responses.ts#L77)*

___
<a id="cookies"></a>

### `<Private>` cookies

**● cookies**: *`object`*

*Defined in [core/http/http-responses.ts:69](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/core/http/http-responses.ts#L69)*

#### Type declaration

[key: `string`]: `object`

 options: [CookieOptions](../interfaces/_core_http_http_responses_.cookieoptions.md)

 value: `string` \| `undefined`

___
<a id="headers"></a>

### `<Private>` headers

**● headers**: *`object`*

*Defined in [core/http/http-responses.ts:70](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/core/http/http-responses.ts#L70)*

#### Type declaration

[key: `string`]: `string`

___
<a id="ishttpresponse"></a>

###  isHttpResponse

**● isHttpResponse**: *`true`* = true

*Defined in [core/http/http-responses.ts:42](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/core/http/http-responses.ts#L42)*

Property used internally by isHttpResponse.

*__memberof__*: HttpResponse

___
<a id="statuscode"></a>

### `<Abstract>` statusCode

**● statusCode**: *`number`*

*Defined in [core/http/http-responses.ts:51](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/core/http/http-responses.ts#L51)*

Status code of the response.

*__abstract__*: 

*__type__*: {number}

*__memberof__*: HttpResponse

___
<a id="statusmessage"></a>

### `<Abstract>` statusMessage

**● statusMessage**: *`string`*

*Defined in [core/http/http-responses.ts:60](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/core/http/http-responses.ts#L60)*

Status message of the response. It must follow the HTTP conventions and be consistent with the statusCode property.

*__abstract__*: 

*__type__*: {string}

*__memberof__*: HttpResponse

___
<a id="stream"></a>

###  stream

**● stream**: *`boolean`* = false

*Defined in [core/http/http-responses.ts:67](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/core/http/http-responses.ts#L67)*

Specify if the body property is a stream.

*__type__*: {boolean}

*__memberof__*: HttpResponse

___

## Methods

<a id="getcookie"></a>

###  getCookie

▸ **getCookie**(name: *`string`*): `object`

*Defined in [core/http/http-responses.ts:138](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/core/http/http-responses.ts#L138)*

Read the value and directives of a cookie added with setCookie.

*__memberof__*: HttpResponse

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| name | `string` |  The cookie name. |

**Returns:** `object`
)} The cookie value and directives or undefined and an empty object if the cookie does not exist.

___
<a id="getcookies"></a>

###  getCookies

▸ **getCookies**(): `object`

*Defined in [core/http/http-responses.ts:153](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/core/http/http-responses.ts#L153)*

Read all the cookies added with setCookie.

*__memberof__*: HttpResponse

**Returns:** `object`
})} The name, value and directives of the cookies.

___
<a id="getheader"></a>

###  getHeader

▸ **getHeader**(name: *`string`*): `string` \| `undefined`

*Defined in [core/http/http-responses.ts:102](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/core/http/http-responses.ts#L102)*

Read the value of a header added with setHeader.

*__memberof__*: HttpResponse

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| name | `string` |  The header name. |

**Returns:** `string` \| `undefined`
The header value or undefined if it does not exist.

___
<a id="getheaders"></a>

###  getHeaders

▸ **getHeaders**(): `object`

*Defined in [core/http/http-responses.ts:112](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/core/http/http-responses.ts#L112)*

Read all the headers added with setHeader.

*__memberof__*: HttpResponse

**Returns:** `object`
*   The headers.

___
<a id="setcookie"></a>

###  setCookie

▸ **setCookie**(name: *`string`*, value: *`string`*, options?: *[CookieOptions](../interfaces/_core_http_http_responses_.cookieoptions.md)*): `this`

*Defined in [core/http/http-responses.ts:125](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/core/http/http-responses.ts#L125)*

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

*Defined in [core/http/http-responses.ts:89](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/core/http/http-responses.ts#L89)*

Add or replace a header in the response.

*__memberof__*: HttpResponse

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| name | `string` |  The header name. |
| value | `string` |  The value name. |

**Returns:** `this`

___

