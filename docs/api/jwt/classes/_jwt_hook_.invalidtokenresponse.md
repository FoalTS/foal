[@foal/jwt](../README.md) > ["jwt.hook"](../modules/_jwt_hook_.md) > [InvalidTokenResponse](../classes/_jwt_hook_.invalidtokenresponse.md)

# Class: InvalidTokenResponse

## Hierarchy

 `HttpResponseUnauthorized`

**↳ InvalidTokenResponse**

## Index

### Constructors

* [constructor](_jwt_hook_.invalidtokenresponse.md#constructor)

### Properties

* [body](_jwt_hook_.invalidtokenresponse.md#body)
* [isHttpResponse](_jwt_hook_.invalidtokenresponse.md#ishttpresponse)
* [isHttpResponseClientError](_jwt_hook_.invalidtokenresponse.md#ishttpresponseclienterror)
* [isHttpResponseUnauthorized](_jwt_hook_.invalidtokenresponse.md#ishttpresponseunauthorized)
* [statusCode](_jwt_hook_.invalidtokenresponse.md#statuscode)
* [statusMessage](_jwt_hook_.invalidtokenresponse.md#statusmessage)
* [stream](_jwt_hook_.invalidtokenresponse.md#stream)

### Methods

* [getCookie](_jwt_hook_.invalidtokenresponse.md#getcookie)
* [getCookies](_jwt_hook_.invalidtokenresponse.md#getcookies)
* [getHeader](_jwt_hook_.invalidtokenresponse.md#getheader)
* [getHeaders](_jwt_hook_.invalidtokenresponse.md#getheaders)
* [setCookie](_jwt_hook_.invalidtokenresponse.md#setcookie)
* [setHeader](_jwt_hook_.invalidtokenresponse.md#setheader)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new InvalidTokenResponse**(description: *`string`*): [InvalidTokenResponse](_jwt_hook_.invalidtokenresponse.md)

*Overrides HttpResponseUnauthorized.__constructor*

*Defined in [jwt.hook.ts:12](https://github.com/FoalTS/foal/blob/538afb23/packages/jwt/src/jwt.hook.ts#L12)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| description | `string` |

**Returns:** [InvalidTokenResponse](_jwt_hook_.invalidtokenresponse.md)

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

**● isHttpResponse**: *`boolean`*

*Inherited from HttpResponse.isHttpResponse*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/jwt/node_modules/@foal/core/lib/core/http/http-responses.d.ts:34*

Property used internally by isHttpResponse.

*__memberof__*: HttpResponse

___
<a id="ishttpresponseclienterror"></a>

###  isHttpResponseClientError

**● isHttpResponseClientError**: *`boolean`*

*Inherited from HttpResponseClientError.isHttpResponseClientError*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/jwt/node_modules/@foal/core/lib/core/http/http-responses.d.ts:451*

Property used internally by isHttpResponseClientError.

*__memberof__*: HttpResponseClientError

___
<a id="ishttpresponseunauthorized"></a>

###  isHttpResponseUnauthorized

**● isHttpResponseUnauthorized**: *`boolean`*

*Inherited from HttpResponseUnauthorized.isHttpResponseUnauthorized*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/jwt/node_modules/@foal/core/lib/core/http/http-responses.d.ts:529*

Property used internally by isHttpResponseUnauthorized.

*__memberof__*: HttpResponseUnauthorized

___
<a id="statuscode"></a>

###  statusCode

**● statusCode**: *`number`*

*Inherited from HttpResponseUnauthorized.statusCode*

*Overrides HttpResponse.statusCode*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/jwt/node_modules/@foal/core/lib/core/http/http-responses.d.ts:530*

___
<a id="statusmessage"></a>

###  statusMessage

**● statusMessage**: *`string`*

*Inherited from HttpResponseUnauthorized.statusMessage*

*Overrides HttpResponse.statusMessage*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/jwt/node_modules/@foal/core/lib/core/http/http-responses.d.ts:531*

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
)} The cookie value and directives
or undefined and an empty object if the cookie does not exist.

___
<a id="getcookies"></a>

###  getCookies

▸ **getCookies**(): `object`

*Inherited from HttpResponse.getCookies*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/jwt/node_modules/@foal/core/lib/core/http/http-responses.d.ts:125*

Read all the cookies added with setCookie.

*__memberof__*: HttpResponse

**Returns:** `object`
})}
The name, value and directives of the cookies.

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
The header value or undefined if it
does not exist.

___
<a id="getheaders"></a>

###  getHeaders

▸ **getHeaders**(): `object`

*Inherited from HttpResponse.getHeaders*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/jwt/node_modules/@foal/core/lib/core/http/http-responses.d.ts:93*

Read all the headers added with setHeader.

*__memberof__*: HttpResponse

**Returns:** `object`
- The headers.

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

