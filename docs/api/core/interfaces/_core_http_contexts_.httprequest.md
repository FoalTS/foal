[@foal/core](../README.md) > ["core/http/contexts"](../modules/_core_http_contexts_.md) > [HTTPRequest](../interfaces/_core_http_contexts_.httprequest.md)

# Interface: HTTPRequest

Interface of the express request object. It also includes a `session` property and a `csrfToken` method.

*__export__*: 

*__interface__*: HTTPRequest

*__extends__*: {Request}

## Hierarchy

 `Request`

**↳ HTTPRequest**

## Implements

* `ReadableStream`

## Index

### Constructors

* [constructor](_core_http_contexts_.httprequest.md#constructor)

### Properties

* [accepted](_core_http_contexts_.httprequest.md#accepted)
* [app](_core_http_contexts_.httprequest.md#app)
* [baseUrl](_core_http_contexts_.httprequest.md#baseurl)
* [body](_core_http_contexts_.httprequest.md#body)
* [connection](_core_http_contexts_.httprequest.md#connection)
* [cookies](_core_http_contexts_.httprequest.md#cookies)
* [csrfToken](_core_http_contexts_.httprequest.md#csrftoken)
* [fresh](_core_http_contexts_.httprequest.md#fresh)
* [headers](_core_http_contexts_.httprequest.md#headers)
* [host](_core_http_contexts_.httprequest.md#host)
* [hostname](_core_http_contexts_.httprequest.md#hostname)
* [httpVersion](_core_http_contexts_.httprequest.md#httpversion)
* [httpVersionMajor](_core_http_contexts_.httprequest.md#httpversionmajor)
* [httpVersionMinor](_core_http_contexts_.httprequest.md#httpversionminor)
* [ip](_core_http_contexts_.httprequest.md#ip)
* [ips](_core_http_contexts_.httprequest.md#ips)
* [method](_core_http_contexts_.httprequest.md#method)
* [next](_core_http_contexts_.httprequest.md#next)
* [originalUrl](_core_http_contexts_.httprequest.md#originalurl)
* [params](_core_http_contexts_.httprequest.md#params)
* [path](_core_http_contexts_.httprequest.md#path)
* [protocol](_core_http_contexts_.httprequest.md#protocol)
* [query](_core_http_contexts_.httprequest.md#query)
* [rawHeaders](_core_http_contexts_.httprequest.md#rawheaders)
* [rawTrailers](_core_http_contexts_.httprequest.md#rawtrailers)
* [readable](_core_http_contexts_.httprequest.md#readable)
* [readableHighWaterMark](_core_http_contexts_.httprequest.md#readablehighwatermark)
* [readableLength](_core_http_contexts_.httprequest.md#readablelength)
* [res](_core_http_contexts_.httprequest.md#res)
* [route](_core_http_contexts_.httprequest.md#route)
* [secure](_core_http_contexts_.httprequest.md#secure)
* [session](_core_http_contexts_.httprequest.md#session)
* [signedCookies](_core_http_contexts_.httprequest.md#signedcookies)
* [socket](_core_http_contexts_.httprequest.md#socket)
* [stale](_core_http_contexts_.httprequest.md#stale)
* [statusCode](_core_http_contexts_.httprequest.md#statuscode)
* [statusMessage](_core_http_contexts_.httprequest.md#statusmessage)
* [subdomains](_core_http_contexts_.httprequest.md#subdomains)
* [trailers](_core_http_contexts_.httprequest.md#trailers)
* [url](_core_http_contexts_.httprequest.md#url)
* [xhr](_core_http_contexts_.httprequest.md#xhr)
* [defaultMaxListeners](_core_http_contexts_.httprequest.md#defaultmaxlisteners)

### Methods

* [__@asyncIterator](_core_http_contexts_.httprequest.md#___asynciterator)
* [_destroy](_core_http_contexts_.httprequest.md#_destroy)
* [_read](_core_http_contexts_.httprequest.md#_read)
* [accepts](_core_http_contexts_.httprequest.md#accepts)
* [acceptsCharsets](_core_http_contexts_.httprequest.md#acceptscharsets)
* [acceptsEncodings](_core_http_contexts_.httprequest.md#acceptsencodings)
* [acceptsLanguages](_core_http_contexts_.httprequest.md#acceptslanguages)
* [addListener](_core_http_contexts_.httprequest.md#addlistener)
* [clearCookie](_core_http_contexts_.httprequest.md#clearcookie)
* [destroy](_core_http_contexts_.httprequest.md#destroy)
* [emit](_core_http_contexts_.httprequest.md#emit)
* [eventNames](_core_http_contexts_.httprequest.md#eventnames)
* [get](_core_http_contexts_.httprequest.md#get)
* [getMaxListeners](_core_http_contexts_.httprequest.md#getmaxlisteners)
* [header](_core_http_contexts_.httprequest.md#header)
* [is](_core_http_contexts_.httprequest.md#is)
* [isPaused](_core_http_contexts_.httprequest.md#ispaused)
* [listenerCount](_core_http_contexts_.httprequest.md#listenercount)
* [listeners](_core_http_contexts_.httprequest.md#listeners)
* [off](_core_http_contexts_.httprequest.md#off)
* [on](_core_http_contexts_.httprequest.md#on)
* [once](_core_http_contexts_.httprequest.md#once)
* [param](_core_http_contexts_.httprequest.md#param)
* [pause](_core_http_contexts_.httprequest.md#pause)
* [pipe](_core_http_contexts_.httprequest.md#pipe)
* [prependListener](_core_http_contexts_.httprequest.md#prependlistener)
* [prependOnceListener](_core_http_contexts_.httprequest.md#prependoncelistener)
* [push](_core_http_contexts_.httprequest.md#push)
* [range](_core_http_contexts_.httprequest.md#range)
* [rawListeners](_core_http_contexts_.httprequest.md#rawlisteners)
* [read](_core_http_contexts_.httprequest.md#read)
* [removeAllListeners](_core_http_contexts_.httprequest.md#removealllisteners)
* [removeListener](_core_http_contexts_.httprequest.md#removelistener)
* [resume](_core_http_contexts_.httprequest.md#resume)
* [setEncoding](_core_http_contexts_.httprequest.md#setencoding)
* [setMaxListeners](_core_http_contexts_.httprequest.md#setmaxlisteners)
* [setTimeout](_core_http_contexts_.httprequest.md#settimeout)
* [unpipe](_core_http_contexts_.httprequest.md#unpipe)
* [unshift](_core_http_contexts_.httprequest.md#unshift)
* [wrap](_core_http_contexts_.httprequest.md#wrap)
* [listenerCount](_core_http_contexts_.httprequest.md#listenercount-1)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new HTTPRequest**(socket: *`Socket`*): [HTTPRequest](_core_http_contexts_.httprequest.md)

*Inherited from IncomingMessage.__constructor*

*Overrides Readable.__constructor*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/http.d.ts:176*

**Parameters:**

| Name | Type |
| ------ | ------ |
| socket | `Socket` |

**Returns:** [HTTPRequest](_core_http_contexts_.httprequest.md)

___

## Properties

<a id="accepted"></a>

###  accepted

**● accepted**: *`MediaType`[]*

*Inherited from Request.accepted*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:306*

Return an array of Accepted media types ordered from highest quality to lowest.

___
<a id="app"></a>

###  app

**● app**: *`Application`*

*Inherited from Request.app*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:452*

___
<a id="baseurl"></a>

###  baseUrl

**● baseUrl**: *`string`*

*Inherited from Request.baseUrl*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:450*

___
<a id="body"></a>

###  body

**● body**: *`any`*

*Inherited from Request.body*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:428*

___
<a id="connection"></a>

###  connection

**● connection**: *`Socket`*

*Inherited from IncomingMessage.connection*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/http.d.ts:182*

___
<a id="cookies"></a>

###  cookies

**● cookies**: *`any`*

*Inherited from Request.cookies*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:431*

___
<a id="csrftoken"></a>

###  csrfToken

**● csrfToken**: *`function`*

*Defined in [core/http/contexts.ts:13](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/core/http/contexts.ts#L13)*

#### Type declaration
▸(): `string`

**Returns:** `string`

___
<a id="fresh"></a>

###  fresh

**● fresh**: *`boolean`*

*Inherited from Request.fresh*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:413*

Check if the request is fresh, aka Last-Modified and/or the ETag still match.

___
<a id="headers"></a>

###  headers

**● headers**: *`IncomingHttpHeaders`*

*Inherited from IncomingMessage.headers*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/http.d.ts:183*

___
<a id="host"></a>

###  host

**● host**: *`string`*

*Inherited from Request.host*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:406*

*__deprecated__*: Use hostname instead.

___
<a id="hostname"></a>

###  hostname

**● hostname**: *`string`*

*Inherited from Request.hostname*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:401*

Parse the "Host" header field hostname.

___
<a id="httpversion"></a>

###  httpVersion

**● httpVersion**: *`string`*

*Inherited from IncomingMessage.httpVersion*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/http.d.ts:179*

___
<a id="httpversionmajor"></a>

###  httpVersionMajor

**● httpVersionMajor**: *`number`*

*Inherited from IncomingMessage.httpVersionMajor*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/http.d.ts:180*

___
<a id="httpversionminor"></a>

###  httpVersionMinor

**● httpVersionMinor**: *`number`*

*Inherited from IncomingMessage.httpVersionMinor*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/http.d.ts:181*

___
<a id="ip"></a>

###  ip

**● ip**: *`string`*

*Inherited from Request.ip*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:368*

Return the remote address, or when "trust proxy" is `true` return the upstream addr.

___
<a id="ips"></a>

###  ips

**● ips**: *`string`[]*

*Inherited from Request.ips*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:378*

When "trust proxy" is `true`, parse the "X-Forwarded-For" ip address list.

For example if the value were "client, proxy1, proxy2" you would receive the array `["client", "proxy1", "proxy2"]` where "proxy2" is the furthest down-stream.

___
<a id="method"></a>

###  method

**● method**: *`string`*

*Inherited from Request.method*

*Overrides IncomingMessage.method*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:433*

___
<a id="next"></a>

### `<Optional>` next

**● next**: *`NextFunction`*

*Inherited from Request.next*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:459*

___
<a id="originalurl"></a>

###  originalUrl

**● originalUrl**: *`string`*

*Inherited from Request.originalUrl*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:446*

___
<a id="params"></a>

###  params

**● params**: *`any`*

*Inherited from Request.params*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:435*

___
<a id="path"></a>

###  path

**● path**: *`string`*

*Inherited from Request.path*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:396*

Short-hand for `url.parse(req.url).pathname`.

___
<a id="protocol"></a>

###  protocol

**● protocol**: *`string`*

*Inherited from Request.protocol*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:354*

Return the protocol string "http" or "https" when requested with TLS. When the "trust proxy" setting is enabled the "X-Forwarded-Proto" header field will be trusted. If you're running behind a reverse proxy that supplies https for you this may be enabled.

___
<a id="query"></a>

###  query

**● query**: *`any`*

*Inherited from Request.query*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:440*

___
<a id="rawheaders"></a>

###  rawHeaders

**● rawHeaders**: *`string`[]*

*Inherited from IncomingMessage.rawHeaders*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/http.d.ts:184*

___
<a id="rawtrailers"></a>

###  rawTrailers

**● rawTrailers**: *`string`[]*

*Inherited from IncomingMessage.rawTrailers*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/http.d.ts:186*

___
<a id="readable"></a>

###  readable

**● readable**: *`boolean`*

*Inherited from Readable.readable*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:20*

___
<a id="readablehighwatermark"></a>

###  readableHighWaterMark

**● readableHighWaterMark**: *`number`*

*Inherited from Readable.readableHighWaterMark*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:21*

___
<a id="readablelength"></a>

###  readableLength

**● readableLength**: *`number`*

*Inherited from Readable.readableLength*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:22*

___
<a id="res"></a>

### `<Optional>` res

**● res**: *`Response`*

*Inherited from Request.res*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:458*

After middleware.init executed, Request will contain res and next properties See: express/lib/middleware/init.js

___
<a id="route"></a>

###  route

**● route**: *`any`*

*Inherited from Request.route*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:442*

___
<a id="secure"></a>

###  secure

**● secure**: *`boolean`*

*Inherited from Request.secure*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:361*

Short-hand for:

req.protocol == 'https'

___
<a id="session"></a>

###  session

**● session**: *`any`*

*Defined in [core/http/contexts.ts:12](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/core/http/contexts.ts#L12)*

___
<a id="signedcookies"></a>

###  signedCookies

**● signedCookies**: *`any`*

*Inherited from Request.signedCookies*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:444*

___
<a id="socket"></a>

###  socket

**● socket**: *`Socket`*

*Inherited from IncomingMessage.socket*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/http.d.ts:204*

___
<a id="stale"></a>

###  stale

**● stale**: *`boolean`*

*Inherited from Request.stale*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:420*

Check if the request is stale, aka "Last-Modified" and / or the "ETag" for the resource has changed.

___
<a id="statuscode"></a>

### `<Optional>` statusCode

**● statusCode**: *`undefined` \| `number`*

*Inherited from IncomingMessage.statusCode*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/http.d.ts:199*

Only valid for response obtained from http.ClientRequest.

___
<a id="statusmessage"></a>

### `<Optional>` statusMessage

**● statusMessage**: *`undefined` \| `string`*

*Inherited from IncomingMessage.statusMessage*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/http.d.ts:203*

Only valid for response obtained from http.ClientRequest.

___
<a id="subdomains"></a>

###  subdomains

**● subdomains**: *`string`[]*

*Inherited from Request.subdomains*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:391*

Return subdomains as an array.

Subdomains are the dot-separated parts of the host before the main domain of the app. By default, the domain of the app is assumed to be the last two parts of the host. This can be changed by setting "subdomain offset".

For example, if the domain is "tobi.ferrets.example.com": If "subdomain offset" is not set, req.subdomains is `["ferrets", "tobi"]`. If "subdomain offset" is 3, req.subdomains is `["tobi"]`.

___
<a id="trailers"></a>

###  trailers

**● trailers**: *`object`*

*Inherited from IncomingMessage.trailers*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/http.d.ts:185*

#### Type declaration

[key: `string`]: `string` \| `undefined`

___
<a id="url"></a>

###  url

**● url**: *`string`*

*Inherited from Request.url*

*Overrides IncomingMessage.url*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:448*

___
<a id="xhr"></a>

###  xhr

**● xhr**: *`boolean`*

*Inherited from Request.xhr*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:425*

Check if the request was an _XMLHttpRequest_.

___
<a id="defaultmaxlisteners"></a>

### `<Static>` defaultMaxListeners

**● defaultMaxListeners**: *`number`*

*Inherited from EventEmitter.defaultMaxListeners*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/events.d.ts:8*

___

## Methods

<a id="___asynciterator"></a>

###  __@asyncIterator

▸ **__@asyncIterator**(): `AsyncIterableIterator`<`any`>

*Inherited from Readable.[Symbol.asyncIterator]*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:95*

**Returns:** `AsyncIterableIterator`<`any`>

___
<a id="_destroy"></a>

###  _destroy

▸ **_destroy**(error: *`Error` \| `null`*, callback: *`function`*): `void`

*Inherited from Readable._destroy*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:34*

**Parameters:**

| Name | Type |
| ------ | ------ |
| error | `Error` \| `null` |
| callback | `function` |

**Returns:** `void`

___
<a id="_read"></a>

###  _read

▸ **_read**(size: *`number`*): `void`

*Inherited from Readable._read*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:24*

**Parameters:**

| Name | Type |
| ------ | ------ |
| size | `number` |

**Returns:** `void`

___
<a id="accepts"></a>

###  accepts

▸ **accepts**(): `string`[]

▸ **accepts**(type: *`string`*): `string` \| `false`

▸ **accepts**(type: *`string`[]*): `string` \| `false`

▸ **accepts**(...type: *`string`[]*): `string` \| `false`

*Inherited from Request.accepts*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:246*

Check if the given `type(s)` is acceptable, returning the best match when true, otherwise `undefined`, in which case you should respond with 406 "Not Acceptable".

The `type` value may be a single mime type string such as "application/json", the extension name such as "json", a comma-delimted list such as "json, html, text/plain", or an array `["json", "html", "text/plain"]`. When a list or array is given the _best_ match, if any is returned.

Examples:

```
// Accept: text/html
req.accepts('html');
// => "html"

// Accept: text/*, application/json
req.accepts('html');
// => "html"
req.accepts('text/html');
// => "text/html"
req.accepts('json, text');
// => "json"
req.accepts('application/json');
// => "application/json"

// Accept: text/*, application/json
req.accepts('image/png');
req.accepts('png');
// => undefined

// Accept: text/*;q=.5, application/json
req.accepts(['html', 'json']);
req.accepts('html, json');
// => "json"
```

**Returns:** `string`[]

*Inherited from Request.accepts*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:247*

**Parameters:**

| Name | Type |
| ------ | ------ |
| type | `string` |

**Returns:** `string` \| `false`

*Inherited from Request.accepts*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:248*

**Parameters:**

| Name | Type |
| ------ | ------ |
| type | `string`[] |

**Returns:** `string` \| `false`

*Inherited from Request.accepts*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:249*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` type | `string`[] |

**Returns:** `string` \| `false`

___
<a id="acceptscharsets"></a>

###  acceptsCharsets

▸ **acceptsCharsets**(): `string`[]

▸ **acceptsCharsets**(charset: *`string`*): `string` \| `false`

▸ **acceptsCharsets**(charset: *`string`[]*): `string` \| `false`

▸ **acceptsCharsets**(...charset: *`string`[]*): `string` \| `false`

*Inherited from Request.acceptsCharsets*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:258*

Returns the first accepted charset of the specified character sets, based on the request's Accept-Charset HTTP header field. If none of the specified charsets is accepted, returns false.

For more information, or if you have issues or concerns, see accepts.

**Returns:** `string`[]

*Inherited from Request.acceptsCharsets*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:259*

**Parameters:**

| Name | Type |
| ------ | ------ |
| charset | `string` |

**Returns:** `string` \| `false`

*Inherited from Request.acceptsCharsets*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:260*

**Parameters:**

| Name | Type |
| ------ | ------ |
| charset | `string`[] |

**Returns:** `string` \| `false`

*Inherited from Request.acceptsCharsets*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:261*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` charset | `string`[] |

**Returns:** `string` \| `false`

___
<a id="acceptsencodings"></a>

###  acceptsEncodings

▸ **acceptsEncodings**(): `string`[]

▸ **acceptsEncodings**(encoding: *`string`*): `string` \| `false`

▸ **acceptsEncodings**(encoding: *`string`[]*): `string` \| `false`

▸ **acceptsEncodings**(...encoding: *`string`[]*): `string` \| `false`

*Inherited from Request.acceptsEncodings*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:270*

Returns the first accepted encoding of the specified encodings, based on the request's Accept-Encoding HTTP header field. If none of the specified encodings is accepted, returns false.

For more information, or if you have issues or concerns, see accepts.

**Returns:** `string`[]

*Inherited from Request.acceptsEncodings*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:271*

**Parameters:**

| Name | Type |
| ------ | ------ |
| encoding | `string` |

**Returns:** `string` \| `false`

*Inherited from Request.acceptsEncodings*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:272*

**Parameters:**

| Name | Type |
| ------ | ------ |
| encoding | `string`[] |

**Returns:** `string` \| `false`

*Inherited from Request.acceptsEncodings*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:273*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` encoding | `string`[] |

**Returns:** `string` \| `false`

___
<a id="acceptslanguages"></a>

###  acceptsLanguages

▸ **acceptsLanguages**(): `string`[]

▸ **acceptsLanguages**(lang: *`string`*): `string` \| `false`

▸ **acceptsLanguages**(lang: *`string`[]*): `string` \| `false`

▸ **acceptsLanguages**(...lang: *`string`[]*): `string` \| `false`

*Inherited from Request.acceptsLanguages*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:282*

Returns the first accepted language of the specified languages, based on the request's Accept-Language HTTP header field. If none of the specified languages is accepted, returns false.

For more information, or if you have issues or concerns, see accepts.

**Returns:** `string`[]

*Inherited from Request.acceptsLanguages*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:283*

**Parameters:**

| Name | Type |
| ------ | ------ |
| lang | `string` |

**Returns:** `string` \| `false`

*Inherited from Request.acceptsLanguages*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:284*

**Parameters:**

| Name | Type |
| ------ | ------ |
| lang | `string`[] |

**Returns:** `string` \| `false`

*Inherited from Request.acceptsLanguages*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:285*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` lang | `string`[] |

**Returns:** `string` \| `false`

___
<a id="addlistener"></a>

###  addListener

▸ **addListener**(event: *"close"*, listener: *`function`*): `this`

▸ **addListener**(event: *"data"*, listener: *`function`*): `this`

▸ **addListener**(event: *"end"*, listener: *`function`*): `this`

▸ **addListener**(event: *"readable"*, listener: *`function`*): `this`

▸ **addListener**(event: *"error"*, listener: *`function`*): `this`

▸ **addListener**(event: *`string` \| `symbol`*, listener: *`function`*): `this`

*Inherited from Readable.addListener*

*Overrides EventEmitter.addListener*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:46*

Event emitter The defined events on documents including:

1.  close
2.  data
3.  end
4.  readable
5.  error

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "close" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.addListener*

*Overrides EventEmitter.addListener*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:47*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "data" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.addListener*

*Overrides EventEmitter.addListener*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:48*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "end" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.addListener*

*Overrides EventEmitter.addListener*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:49*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "readable" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.addListener*

*Overrides EventEmitter.addListener*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:50*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "error" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.addListener*

*Overrides EventEmitter.addListener*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:51*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |
| listener | `function` |

**Returns:** `this`

___
<a id="clearcookie"></a>

###  clearCookie

▸ **clearCookie**(name: *`string`*, options?: *`any`*): `Response`

*Inherited from Request.clearCookie*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:438*

Clear cookie `name`.

**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |
| `Optional` options | `any` |

**Returns:** `Response`

___
<a id="destroy"></a>

###  destroy

▸ **destroy**(error?: *[Error](../classes/_common_errors_object_does_not_exist_.objectdoesnotexist.md#error)*): `void`

*Inherited from IncomingMessage.destroy*

*Overrides Readable.destroy*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/http.d.ts:205*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` error | [Error](../classes/_common_errors_object_does_not_exist_.objectdoesnotexist.md#error) |

**Returns:** `void`

___
<a id="emit"></a>

###  emit

▸ **emit**(event: *"close"*): `boolean`

▸ **emit**(event: *"data"*, chunk: *`any`*): `boolean`

▸ **emit**(event: *"end"*): `boolean`

▸ **emit**(event: *"readable"*): `boolean`

▸ **emit**(event: *"error"*, err: *`Error`*): `boolean`

▸ **emit**(event: *`string` \| `symbol`*, ...args: *`any`[]*): `boolean`

*Inherited from Readable.emit*

*Overrides EventEmitter.emit*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:53*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "close" |

**Returns:** `boolean`

*Inherited from Readable.emit*

*Overrides EventEmitter.emit*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:54*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "data" |
| chunk | `any` |

**Returns:** `boolean`

*Inherited from Readable.emit*

*Overrides EventEmitter.emit*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:55*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "end" |

**Returns:** `boolean`

*Inherited from Readable.emit*

*Overrides EventEmitter.emit*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:56*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "readable" |

**Returns:** `boolean`

*Inherited from Readable.emit*

*Overrides EventEmitter.emit*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:57*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "error" |
| err | `Error` |

**Returns:** `boolean`

*Inherited from Readable.emit*

*Overrides EventEmitter.emit*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:58*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |
| `Rest` args | `any`[] |

**Returns:** `boolean`

___
<a id="eventnames"></a>

###  eventNames

▸ **eventNames**(): `Array`<`string` \| `symbol`>

*Inherited from EventEmitter.eventNames*

*Overrides EventEmitter.eventNames*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/events.d.ts:23*

**Returns:** `Array`<`string` \| `symbol`>

___
<a id="get"></a>

###  get

▸ **get**(name: *"set-cookie"*): `string`[] \| `undefined`

▸ **get**(name: *`string`*): `string` \| `undefined`

*Inherited from Request.get*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:203*

Return request header.

The `Referrer` header field is special-cased, both `Referrer` and `Referer` are interchangeable.

Examples:

```
req.get('Content-Type');
// => "text/plain"

req.get('content-type');
// => "text/plain"

req.get('Something');
// => undefined
```

Aliased as `req.header()`.

**Parameters:**

| Name | Type |
| ------ | ------ |
| name | "set-cookie" |

**Returns:** `string`[] \| `undefined`

*Inherited from Request.get*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:204*

**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |

**Returns:** `string` \| `undefined`

___
<a id="getmaxlisteners"></a>

###  getMaxListeners

▸ **getMaxListeners**(): `number`

*Inherited from EventEmitter.getMaxListeners*

*Overrides EventEmitter.getMaxListeners*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/events.d.ts:19*

**Returns:** `number`

___
<a id="header"></a>

###  header

▸ **header**(name: *"set-cookie"*): `string`[] \| `undefined`

▸ **header**(name: *`string`*): `string` \| `undefined`

*Inherited from Request.header*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:206*

**Parameters:**

| Name | Type |
| ------ | ------ |
| name | "set-cookie" |

**Returns:** `string`[] \| `undefined`

*Inherited from Request.header*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:207*

**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |

**Returns:** `string` \| `undefined`

___
<a id="is"></a>

###  is

▸ **is**(type: *`string`*): `string` \| `false`

*Inherited from Request.is*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:344*

Check if the incoming request contains the "Content-Type" header field, and it contains the give mime `type`.

Examples:

```
 // With Content-Type: text/html; charset=utf-8
 req.is('html');
 req.is('text/html');
 req.is('text/*');
 // => true

 // When Content-Type is application/json
 req.is('json');
 req.is('application/json');
 req.is('application/*');
 // => true

 req.is('html');
 // => false
```

**Parameters:**

| Name | Type |
| ------ | ------ |
| type | `string` |

**Returns:** `string` \| `false`

___
<a id="ispaused"></a>

###  isPaused

▸ **isPaused**(): `boolean`

*Inherited from Readable.isPaused*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:29*

**Returns:** `boolean`

___
<a id="listenercount"></a>

###  listenerCount

▸ **listenerCount**(type: *`string` \| `symbol`*): `number`

*Inherited from EventEmitter.listenerCount*

*Overrides EventEmitter.listenerCount*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/events.d.ts:24*

**Parameters:**

| Name | Type |
| ------ | ------ |
| type | `string` \| `symbol` |

**Returns:** `number`

___
<a id="listeners"></a>

###  listeners

▸ **listeners**(event: *`string` \| `symbol`*): `Function`[]

*Inherited from EventEmitter.listeners*

*Overrides EventEmitter.listeners*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/events.d.ts:20*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |

**Returns:** `Function`[]

___
<a id="off"></a>

###  off

▸ **off**(event: *`string` \| `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.off*

*Overrides EventEmitter.off*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/events.d.ts:16*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |
| listener | `function` |

**Returns:** `this`

___
<a id="on"></a>

###  on

▸ **on**(event: *"close"*, listener: *`function`*): `this`

▸ **on**(event: *"data"*, listener: *`function`*): `this`

▸ **on**(event: *"end"*, listener: *`function`*): `this`

▸ **on**(event: *"readable"*, listener: *`function`*): `this`

▸ **on**(event: *"error"*, listener: *`function`*): `this`

▸ **on**(event: *`string` \| `symbol`*, listener: *`function`*): `this`

*Inherited from Readable.on*

*Overrides EventEmitter.on*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:60*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "close" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.on*

*Overrides EventEmitter.on*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:61*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "data" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.on*

*Overrides EventEmitter.on*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:62*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "end" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.on*

*Overrides EventEmitter.on*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:63*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "readable" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.on*

*Overrides EventEmitter.on*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:64*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "error" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.on*

*Overrides EventEmitter.on*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:65*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |
| listener | `function` |

**Returns:** `this`

___
<a id="once"></a>

###  once

▸ **once**(event: *"close"*, listener: *`function`*): `this`

▸ **once**(event: *"data"*, listener: *`function`*): `this`

▸ **once**(event: *"end"*, listener: *`function`*): `this`

▸ **once**(event: *"readable"*, listener: *`function`*): `this`

▸ **once**(event: *"error"*, listener: *`function`*): `this`

▸ **once**(event: *`string` \| `symbol`*, listener: *`function`*): `this`

*Inherited from Readable.once*

*Overrides EventEmitter.once*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:67*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "close" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.once*

*Overrides EventEmitter.once*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:68*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "data" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.once*

*Overrides EventEmitter.once*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:69*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "end" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.once*

*Overrides EventEmitter.once*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:70*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "readable" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.once*

*Overrides EventEmitter.once*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:71*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "error" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.once*

*Overrides EventEmitter.once*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:72*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |
| listener | `function` |

**Returns:** `this`

___
<a id="param"></a>

###  param

▸ **param**(name: *`string`*, defaultValue?: *`any`*): `string`

*Inherited from Request.param*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:321*

*__deprecated__*: since 4.11 Use either req.params, req.body or req.query, as applicable.

Return the value of param `name` when present or `defaultValue`.

*   Checks route placeholders, ex: _/user/:id_
*   Checks body params, ex: id=12, {"id":12}
*   Checks query string params, ex: ?id=12

To utilize request bodies, `req.body` should be an object. This can be done by using the `connect.bodyParser()` middleware.

**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |
| `Optional` defaultValue | `any` |

**Returns:** `string`

___
<a id="pause"></a>

###  pause

▸ **pause**(): `this`

*Inherited from Readable.pause*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:27*

**Returns:** `this`

___
<a id="pipe"></a>

###  pipe

▸ **pipe**<`T`>(destination: *`T`*, options?: *`undefined` \| `object`*): `T`

*Inherited from internal.pipe*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:5*

**Type parameters:**

#### T :  `WritableStream`
**Parameters:**

| Name | Type |
| ------ | ------ |
| destination | `T` |
| `Optional` options | `undefined` \| `object` |

**Returns:** `T`

___
<a id="prependlistener"></a>

###  prependListener

▸ **prependListener**(event: *"close"*, listener: *`function`*): `this`

▸ **prependListener**(event: *"data"*, listener: *`function`*): `this`

▸ **prependListener**(event: *"end"*, listener: *`function`*): `this`

▸ **prependListener**(event: *"readable"*, listener: *`function`*): `this`

▸ **prependListener**(event: *"error"*, listener: *`function`*): `this`

▸ **prependListener**(event: *`string` \| `symbol`*, listener: *`function`*): `this`

*Inherited from Readable.prependListener*

*Overrides EventEmitter.prependListener*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:74*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "close" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.prependListener*

*Overrides EventEmitter.prependListener*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:75*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "data" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.prependListener*

*Overrides EventEmitter.prependListener*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:76*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "end" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.prependListener*

*Overrides EventEmitter.prependListener*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:77*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "readable" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.prependListener*

*Overrides EventEmitter.prependListener*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:78*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "error" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.prependListener*

*Overrides EventEmitter.prependListener*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:79*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |
| listener | `function` |

**Returns:** `this`

___
<a id="prependoncelistener"></a>

###  prependOnceListener

▸ **prependOnceListener**(event: *"close"*, listener: *`function`*): `this`

▸ **prependOnceListener**(event: *"data"*, listener: *`function`*): `this`

▸ **prependOnceListener**(event: *"end"*, listener: *`function`*): `this`

▸ **prependOnceListener**(event: *"readable"*, listener: *`function`*): `this`

▸ **prependOnceListener**(event: *"error"*, listener: *`function`*): `this`

▸ **prependOnceListener**(event: *`string` \| `symbol`*, listener: *`function`*): `this`

*Inherited from Readable.prependOnceListener*

*Overrides EventEmitter.prependOnceListener*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:81*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "close" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.prependOnceListener*

*Overrides EventEmitter.prependOnceListener*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:82*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "data" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.prependOnceListener*

*Overrides EventEmitter.prependOnceListener*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:83*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "end" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.prependOnceListener*

*Overrides EventEmitter.prependOnceListener*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:84*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "readable" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.prependOnceListener*

*Overrides EventEmitter.prependOnceListener*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:85*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "error" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.prependOnceListener*

*Overrides EventEmitter.prependOnceListener*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:86*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |
| listener | `function` |

**Returns:** `this`

___
<a id="push"></a>

###  push

▸ **push**(chunk: *`any`*, encoding?: *`undefined` \| `string`*): `boolean`

*Inherited from Readable.push*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:33*

**Parameters:**

| Name | Type |
| ------ | ------ |
| chunk | `any` |
| `Optional` encoding | `undefined` \| `string` |

**Returns:** `boolean`

___
<a id="range"></a>

###  range

▸ **range**(size: *`number`*, options?: *`RangeParserOptions`*): `RangeParserRanges` \| `RangeParserResult` \| `undefined`

*Inherited from Request.range*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:300*

Parse Range header field, capping to the given `size`.

Unspecified ranges such as "0-" require knowledge of your resource length. In the case of a byte range this is of course the total number of bytes. If the Range header field is not given `undefined` is returned. If the Range header field is given, return value is a result of range-parser. See more ./types/range-parser/index.d.ts

NOTE: remember that ranges are inclusive, so for example "Range: users=0-3" should respond with 4 users when available, not 3.

**Parameters:**

| Name | Type |
| ------ | ------ |
| size | `number` |
| `Optional` options | `RangeParserOptions` |

**Returns:** `RangeParserRanges` \| `RangeParserResult` \| `undefined`

___
<a id="rawlisteners"></a>

###  rawListeners

▸ **rawListeners**(event: *`string` \| `symbol`*): `Function`[]

*Inherited from EventEmitter.rawListeners*

*Overrides EventEmitter.rawListeners*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/events.d.ts:21*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |

**Returns:** `Function`[]

___
<a id="read"></a>

###  read

▸ **read**(size?: *`undefined` \| `number`*): `any`

*Inherited from Readable.read*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:25*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` size | `undefined` \| `number` |

**Returns:** `any`

___
<a id="removealllisteners"></a>

###  removeAllListeners

▸ **removeAllListeners**(event?: *`string` \| `symbol`*): `this`

*Inherited from EventEmitter.removeAllListeners*

*Overrides EventEmitter.removeAllListeners*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/events.d.ts:17*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` event | `string` \| `symbol` |

**Returns:** `this`

___
<a id="removelistener"></a>

###  removeListener

▸ **removeListener**(event: *"close"*, listener: *`function`*): `this`

▸ **removeListener**(event: *"data"*, listener: *`function`*): `this`

▸ **removeListener**(event: *"end"*, listener: *`function`*): `this`

▸ **removeListener**(event: *"readable"*, listener: *`function`*): `this`

▸ **removeListener**(event: *"error"*, listener: *`function`*): `this`

▸ **removeListener**(event: *`string` \| `symbol`*, listener: *`function`*): `this`

*Inherited from Readable.removeListener*

*Overrides EventEmitter.removeListener*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:88*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "close" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.removeListener*

*Overrides EventEmitter.removeListener*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:89*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "data" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.removeListener*

*Overrides EventEmitter.removeListener*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:90*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "end" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.removeListener*

*Overrides EventEmitter.removeListener*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:91*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "readable" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.removeListener*

*Overrides EventEmitter.removeListener*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:92*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "error" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.removeListener*

*Overrides EventEmitter.removeListener*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:93*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |
| listener | `function` |

**Returns:** `this`

___
<a id="resume"></a>

###  resume

▸ **resume**(): `this`

*Inherited from Readable.resume*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:28*

**Returns:** `this`

___
<a id="setencoding"></a>

###  setEncoding

▸ **setEncoding**(encoding: *`string`*): `this`

*Inherited from Readable.setEncoding*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:26*

**Parameters:**

| Name | Type |
| ------ | ------ |
| encoding | `string` |

**Returns:** `this`

___
<a id="setmaxlisteners"></a>

###  setMaxListeners

▸ **setMaxListeners**(n: *`number`*): `this`

*Inherited from EventEmitter.setMaxListeners*

*Overrides EventEmitter.setMaxListeners*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/events.d.ts:18*

**Parameters:**

| Name | Type |
| ------ | ------ |
| n | `number` |

**Returns:** `this`

___
<a id="settimeout"></a>

###  setTimeout

▸ **setTimeout**(msecs: *`number`*, callback: *`function`*): `this`

*Inherited from IncomingMessage.setTimeout*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/http.d.ts:187*

**Parameters:**

| Name | Type |
| ------ | ------ |
| msecs | `number` |
| callback | `function` |

**Returns:** `this`

___
<a id="unpipe"></a>

###  unpipe

▸ **unpipe**(destination?: *`NodeJS.WritableStream`*): `this`

*Inherited from Readable.unpipe*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:30*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` destination | `NodeJS.WritableStream` |

**Returns:** `this`

___
<a id="unshift"></a>

###  unshift

▸ **unshift**(chunk: *`any`*): `void`

*Inherited from Readable.unshift*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:31*

**Parameters:**

| Name | Type |
| ------ | ------ |
| chunk | `any` |

**Returns:** `void`

___
<a id="wrap"></a>

###  wrap

▸ **wrap**(oldStream: *`ReadableStream`*): `this`

*Inherited from Readable.wrap*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/stream.d.ts:32*

**Parameters:**

| Name | Type |
| ------ | ------ |
| oldStream | `ReadableStream` |

**Returns:** `this`

___
<a id="listenercount-1"></a>

### `<Static>` listenerCount

▸ **listenerCount**(emitter: *`EventEmitter`*, event: *`string` \| `symbol`*): `number`

*Inherited from EventEmitter.listenerCount*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/events.d.ts:7*

*__deprecated__*: since v4.0.0

**Parameters:**

| Name | Type |
| ------ | ------ |
| emitter | `EventEmitter` |
| event | `string` \| `symbol` |

**Returns:** `number`

___

