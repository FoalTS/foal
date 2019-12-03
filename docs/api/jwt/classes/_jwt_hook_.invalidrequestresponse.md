[@foal/jwt](../README.md) > ["jwt.hook"](../modules/_jwt_hook_.md) > [InvalidRequestResponse](../classes/_jwt_hook_.invalidrequestresponse.md)

# Class: InvalidRequestResponse

## Hierarchy

 `HttpResponseBadRequest`

**↳ InvalidRequestResponse**

## Index

### Constructors

* [constructor](_jwt_hook_.invalidrequestresponse.md#constructor)

### Properties

* [body](_jwt_hook_.invalidrequestresponse.md#body)
* [isHttpResponse](_jwt_hook_.invalidrequestresponse.md#ishttpresponse)
* [isHttpResponseBadRequest](_jwt_hook_.invalidrequestresponse.md#ishttpresponsebadrequest)
* [isHttpResponseClientError](_jwt_hook_.invalidrequestresponse.md#ishttpresponseclienterror)
* [statusCode](_jwt_hook_.invalidrequestresponse.md#statuscode)
* [statusMessage](_jwt_hook_.invalidrequestresponse.md#statusmessage)
* [stream](_jwt_hook_.invalidrequestresponse.md#stream)

### Methods

* [getCookie](_jwt_hook_.invalidrequestresponse.md#getcookie)
* [getCookies](_jwt_hook_.invalidrequestresponse.md#getcookies)
* [getHeader](_jwt_hook_.invalidrequestresponse.md#getheader)
* [getHeaders](_jwt_hook_.invalidrequestresponse.md#getheaders)
* [setCookie](_jwt_hook_.invalidrequestresponse.md#setcookie)
* [setHeader](_jwt_hook_.invalidrequestresponse.md#setheader)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new InvalidRequestResponse**(description: *`string`*): [InvalidRequestResponse](_jwt_hook_.invalidrequestresponse.md)

*Overrides HttpResponseBadRequest.__constructor*

*Defined in [jwt.hook.ts:24](https://github.com/FoalTS/foal/blob/70cc46bd/packages/jwt/src/jwt.hook.ts#L24)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| description | `string` |

**Returns:** [InvalidRequestResponse](_jwt_hook_.invalidrequestresponse.md)

___

## Properties

<a id="body"></a>

### `<Optional>` body

**● body**: *`any`*

*Inherited from HttpResponse.body*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/jwt/node_modules/@foal/core/lib/core/http/http-responses.d.ts:28*

___
<a id="ishttpresponse"></a>

###  isHttpResponse

**● isHttpResponse**: *`true`* = true

*Inherited from HttpResponse.isHttpResponse*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/jwt/node_modules/@foal/core/lib/core/http/http-responses.d.ts:34*

Property used internally by isHttpResponse.

*__memberof__*: HttpResponse

___
<a id="ishttpresponsebadrequest"></a>

###  isHttpResponseBadRequest

**● isHttpResponseBadRequest**: *`true`* = true

*Inherited from HttpResponseBadRequest.isHttpResponseBadRequest*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/jwt/node_modules/@foal/core/lib/core/http/http-responses.d.ts:489*

Property used internally by isHttpResponseBadRequest.

*__memberof__*: HttpResponseBadRequest

___
<a id="ishttpresponseclienterror"></a>

###  isHttpResponseClientError

**● isHttpResponseClientError**: *`true`* = true

*Inherited from HttpResponseClientError.isHttpResponseClientError*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/jwt/node_modules/@foal/core/lib/core/http/http-responses.d.ts:451*

Property used internally by isHttpResponseClientError.

*__memberof__*: HttpResponseClientError

___
<a id="statuscode"></a>

###  statusCode

**● statusCode**: *`number`*

*Inherited from HttpResponseBadRequest.statusCode*

*Overrides HttpResponse.statusCode*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/jwt/node_modules/@foal/core/lib/core/http/http-responses.d.ts:490*

___
<a id="statusmessage"></a>

###  statusMessage

**● statusMessage**: *`string`*

*Inherited from HttpResponseBadRequest.statusMessage*

*Overrides HttpResponse.statusMessage*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/jwt/node_modules/@foal/core/lib/core/http/http-responses.d.ts:491*

___
<a id="stream"></a>

###  stream

**● stream**: *`boolean`*

*Inherited from HttpResponse.stream*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/jwt/node_modules/@foal/core/lib/core/http/http-responses.d.ts:58*

Specify if the body property is a stream.

*__type__*: {boolean}

*__memberof__*: HttpResponse

___

## Methods

<a id="getcookie"></a>

###  getCookie

▸ **getCookie**(name: *`string`*): `object`

*Inherited from HttpResponse.getCookie*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/jwt/node_modules/@foal/core/lib/core/http/http-responses.d.ts:114*

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

*Inherited from HttpResponse.getCookies*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/jwt/node_modules/@foal/core/lib/core/http/http-responses.d.ts:125*

Read all the cookies added with setCookie.

*__memberof__*: HttpResponse

**Returns:** `object`
})} The name, value and directives of the cookies.

___
<a id="getheader"></a>

###  getHeader

▸ **getHeader**(name: *`string`*): `string` \| `undefined`

*Inherited from HttpResponse.getHeader*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/jwt/node_modules/@foal/core/lib/core/http/http-responses.d.ts:86*

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

*Inherited from HttpResponse.getHeaders*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/jwt/node_modules/@foal/core/lib/core/http/http-responses.d.ts:93*

Read all the headers added with setHeader.

*__memberof__*: HttpResponse

**Returns:** `object`
*   The headers.

___
<a id="setcookie"></a>

###  setCookie

▸ **setCookie**(name: *`string`*, value: *`string`*, options?: *`CookieOptions`*): `this`

*Inherited from HttpResponse.setCookie*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/jwt/node_modules/@foal/core/lib/core/http/http-responses.d.ts:105*

Add or replace a cookie in the response.

*__memberof__*: HttpResponse

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| name | `string` |  The cookie name. |
| value | `string` |  The cookie value. |
| `Optional` options | `CookieOptions` |

**Returns:** `this`

___
<a id="setheader"></a>

###  setHeader

▸ **setHeader**(name: *`string`*, value: *`string`*): `this`

*Inherited from HttpResponse.setHeader*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/jwt/node_modules/@foal/core/lib/core/http/http-responses.d.ts:77*

Add or replace a header in the response.

*__memberof__*: HttpResponse

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| name | `string` |  The header name. |
| value | `string` |  The value name. |

**Returns:** `this`

___

