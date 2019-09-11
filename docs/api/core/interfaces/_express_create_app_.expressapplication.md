[@foal/core](../README.md) > ["express/create-app"](../modules/_express_create_app_.md) > [ExpressApplication](../interfaces/_express_create_app_.expressapplication.md)

# Interface: ExpressApplication

## Hierarchy

 `Express`

**↳ ExpressApplication**

## Callable
▸ **__call**(req: *`Request` \| `IncomingMessage`*, res: *`Response` \| `ServerResponse`*): `any`

▸ **__call**(req: *`Request`*, res: *`Response`*, next: *`NextFunction`*): `any`

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:852*

Express instance itself is a request handler, which could be invoked without third argument.

**Parameters:**

| Name | Type |
| ------ | ------ |
| req | `Request` \| `IncomingMessage` |
| res | `Response` \| `ServerResponse` |

**Returns:** `any`

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:34*

**Parameters:**

| Name | Type |
| ------ | ------ |
| req | `Request` |
| res | `Response` |
| next | `NextFunction` |

**Returns:** `any`

## Indexable

\[name: `string`\]:&nbsp;`any`
## Index

### Properties

* [_router](_express_create_app_.expressapplication.md#_router)
* [all](_express_create_app_.expressapplication.md#all)
* [checkout](_express_create_app_.expressapplication.md#checkout)
* [connect](_express_create_app_.expressapplication.md#connect)
* [copy](_express_create_app_.expressapplication.md#copy)
* [delete](_express_create_app_.expressapplication.md#delete)
* [get](_express_create_app_.expressapplication.md#get)
* [head](_express_create_app_.expressapplication.md#head)
* [locals](_express_create_app_.expressapplication.md#locals)
* [lock](_express_create_app_.expressapplication.md#lock)
* [m-search](_express_create_app_.expressapplication.md#m_search)
* [map](_express_create_app_.expressapplication.md#map)
* [merge](_express_create_app_.expressapplication.md#merge)
* [mkactivity](_express_create_app_.expressapplication.md#mkactivity)
* [mkcol](_express_create_app_.expressapplication.md#mkcol)
* [mountpath](_express_create_app_.expressapplication.md#mountpath)
* [move](_express_create_app_.expressapplication.md#move)
* [notify](_express_create_app_.expressapplication.md#notify)
* [on](_express_create_app_.expressapplication.md#on)
* [options](_express_create_app_.expressapplication.md#options)
* [patch](_express_create_app_.expressapplication.md#patch)
* [post](_express_create_app_.expressapplication.md#post)
* [propfind](_express_create_app_.expressapplication.md#propfind)
* [proppatch](_express_create_app_.expressapplication.md#proppatch)
* [purge](_express_create_app_.expressapplication.md#purge)
* [put](_express_create_app_.expressapplication.md#put)
* [report](_express_create_app_.expressapplication.md#report)
* [request](_express_create_app_.expressapplication.md#request)
* [resource](_express_create_app_.expressapplication.md#resource)
* [response](_express_create_app_.expressapplication.md#response)
* [router](_express_create_app_.expressapplication.md#router)
* [routes](_express_create_app_.expressapplication.md#routes)
* [search](_express_create_app_.expressapplication.md#search)
* [settings](_express_create_app_.expressapplication.md#settings)
* [stack](_express_create_app_.expressapplication.md#stack)
* [subscribe](_express_create_app_.expressapplication.md#subscribe)
* [trace](_express_create_app_.expressapplication.md#trace)
* [unlock](_express_create_app_.expressapplication.md#unlock)
* [unsubscribe](_express_create_app_.expressapplication.md#unsubscribe)
* [use](_express_create_app_.expressapplication.md#use)
* [defaultMaxListeners](_express_create_app_.expressapplication.md#defaultmaxlisteners)

### Methods

* [addListener](_express_create_app_.expressapplication.md#addlistener)
* [defaultConfiguration](_express_create_app_.expressapplication.md#defaultconfiguration)
* [disable](_express_create_app_.expressapplication.md#disable)
* [disabled](_express_create_app_.expressapplication.md#disabled)
* [emit](_express_create_app_.expressapplication.md#emit)
* [enable](_express_create_app_.expressapplication.md#enable)
* [enabled](_express_create_app_.expressapplication.md#enabled)
* [engine](_express_create_app_.expressapplication.md#engine)
* [eventNames](_express_create_app_.expressapplication.md#eventnames)
* [getMaxListeners](_express_create_app_.expressapplication.md#getmaxlisteners)
* [init](_express_create_app_.expressapplication.md#init)
* [listen](_express_create_app_.expressapplication.md#listen)
* [listenerCount](_express_create_app_.expressapplication.md#listenercount)
* [listeners](_express_create_app_.expressapplication.md#listeners)
* [off](_express_create_app_.expressapplication.md#off)
* [once](_express_create_app_.expressapplication.md#once)
* [param](_express_create_app_.expressapplication.md#param)
* [path](_express_create_app_.expressapplication.md#path)
* [prependListener](_express_create_app_.expressapplication.md#prependlistener)
* [prependOnceListener](_express_create_app_.expressapplication.md#prependoncelistener)
* [rawListeners](_express_create_app_.expressapplication.md#rawlisteners)
* [removeAllListeners](_express_create_app_.expressapplication.md#removealllisteners)
* [removeListener](_express_create_app_.expressapplication.md#removelistener)
* [render](_express_create_app_.expressapplication.md#render)
* [route](_express_create_app_.expressapplication.md#route)
* [set](_express_create_app_.expressapplication.md#set)
* [setMaxListeners](_express_create_app_.expressapplication.md#setmaxlisteners)
* [listenerCount](_express_create_app_.expressapplication.md#listenercount-1)

---

## Properties

<a id="_router"></a>

###  _router

**● _router**: *`any`*

*Inherited from Application._router*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:1030*

Used to get all registered routes in Express Application

___
<a id="all"></a>

###  all

**● all**: *`IRouterMatcher`<`this`>*

*Inherited from IRouter.all*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:96*

Special-cased "all" method, applying the given route `path`, middleware, and callback to _every_ HTTP method.

___
<a id="checkout"></a>

###  checkout

**● checkout**: *`IRouterMatcher`<`this`>*

*Inherited from IRouter.checkout*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:105*

___
<a id="connect"></a>

###  connect

**● connect**: *`IRouterMatcher`<`this`>*

*Inherited from IRouter.connect*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:106*

___
<a id="copy"></a>

###  copy

**● copy**: *`IRouterMatcher`<`this`>*

*Inherited from IRouter.copy*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:107*

___
<a id="delete"></a>

###  delete

**● delete**: *`IRouterMatcher`<`this`>*

*Inherited from IRouter.delete*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:100*

___
<a id="get"></a>

###  get

**● get**: *`function` & `IRouterMatcher`<`this`>*

*Inherited from Application.get*

*Overrides IRouter.get*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:916*

___
<a id="head"></a>

###  head

**● head**: *`IRouterMatcher`<`this`>*

*Inherited from IRouter.head*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:103*

___
<a id="locals"></a>

###  locals

**● locals**: *`any`*

*Inherited from Application.locals*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:1015*

___
<a id="lock"></a>

###  lock

**● lock**: *`IRouterMatcher`<`this`>*

*Inherited from IRouter.lock*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:108*

___
<a id="m_search"></a>

###  m-search

**● m-search**: *`IRouterMatcher`<`this`>*

*Inherited from IRouter.&amp;quot;m-search&amp;quot;*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:113*

___
<a id="map"></a>

###  map

**● map**: *`any`*

*Inherited from Application.map*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:1013*

___
<a id="merge"></a>

###  merge

**● merge**: *`IRouterMatcher`<`this`>*

*Inherited from IRouter.merge*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:109*

___
<a id="mkactivity"></a>

###  mkactivity

**● mkactivity**: *`IRouterMatcher`<`this`>*

*Inherited from IRouter.mkactivity*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:110*

___
<a id="mkcol"></a>

###  mkcol

**● mkcol**: *`IRouterMatcher`<`this`>*

*Inherited from IRouter.mkcol*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:111*

___
<a id="mountpath"></a>

###  mountpath

**● mountpath**: *`string` \| `string`[]*

*Inherited from Application.mountpath*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:1048*

The app.mountpath property contains one or more path patterns on which a sub-app was mounted.

___
<a id="move"></a>

###  move

**● move**: *`IRouterMatcher`<`this`>*

*Inherited from IRouter.move*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:112*

___
<a id="notify"></a>

###  notify

**● notify**: *`IRouterMatcher`<`this`>*

*Inherited from IRouter.notify*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:114*

___
<a id="on"></a>

###  on

**● on**: *`function`*

*Inherited from Application.on*

*Overrides EventEmitter.on*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:1043*

The mount event is fired on a sub-app, when it is mounted on a parent app. The parent app is passed to the callback function.

NOTE: Sub-apps will:

*   Not inherit the value of settings that have a default value. You must set the value in the sub-app.
*   Inherit the value of settings with no default value.

#### Type declaration
▸(event: *`string`*, callback: *`function`*): `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` |
| callback | `function` |

**Returns:** `this`

___
<a id="options"></a>

###  options

**● options**: *`IRouterMatcher`<`this`>*

*Inherited from IRouter.options*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:102*

___
<a id="patch"></a>

###  patch

**● patch**: *`IRouterMatcher`<`this`>*

*Inherited from IRouter.patch*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:101*

___
<a id="post"></a>

###  post

**● post**: *`IRouterMatcher`<`this`>*

*Inherited from IRouter.post*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:98*

___
<a id="propfind"></a>

###  propfind

**● propfind**: *`IRouterMatcher`<`this`>*

*Inherited from IRouter.propfind*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:115*

___
<a id="proppatch"></a>

###  proppatch

**● proppatch**: *`IRouterMatcher`<`this`>*

*Inherited from IRouter.proppatch*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:116*

___
<a id="purge"></a>

###  purge

**● purge**: *`IRouterMatcher`<`this`>*

*Inherited from IRouter.purge*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:117*

___
<a id="put"></a>

###  put

**● put**: *`IRouterMatcher`<`this`>*

*Inherited from IRouter.put*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:99*

___
<a id="report"></a>

###  report

**● report**: *`IRouterMatcher`<`this`>*

*Inherited from IRouter.report*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:118*

___
<a id="request"></a>

###  request

**● request**: *`Request`*

*Inherited from Express.request*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:1052*

___
<a id="resource"></a>

###  resource

**● resource**: *`any`*

*Inherited from Application.resource*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:1011*

___
<a id="response"></a>

###  response

**● response**: *`Response`*

*Inherited from Express.response*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:1053*

___
<a id="router"></a>

###  router

**● router**: *`string`*

*Inherited from Application.router*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:1007*

___
<a id="routes"></a>

###  routes

**● routes**: *`any`*

*Inherited from Application.routes*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:1025*

The app.routes object houses all of the routes defined mapped by the associated HTTP verb. This object may be used for introspection capabilities, for example Express uses this internally not only for routing but to provide default OPTIONS behaviour unless app.options() is used. Your application or framework may also remove routes by simply by removing them from this object.

___
<a id="search"></a>

###  search

**● search**: *`IRouterMatcher`<`this`>*

*Inherited from IRouter.search*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:119*

___
<a id="settings"></a>

###  settings

**● settings**: *`any`*

*Inherited from Application.settings*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:1009*

___
<a id="stack"></a>

###  stack

**● stack**: *`any`[]*

*Inherited from IRouter.stack*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:131*

Stack of configured routes

___
<a id="subscribe"></a>

###  subscribe

**● subscribe**: *`IRouterMatcher`<`this`>*

*Inherited from IRouter.subscribe*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:120*

___
<a id="trace"></a>

###  trace

**● trace**: *`IRouterMatcher`<`this`>*

*Inherited from IRouter.trace*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:121*

___
<a id="unlock"></a>

###  unlock

**● unlock**: *`IRouterMatcher`<`this`>*

*Inherited from IRouter.unlock*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:122*

___
<a id="unsubscribe"></a>

###  unsubscribe

**● unsubscribe**: *`IRouterMatcher`<`this`>*

*Inherited from IRouter.unsubscribe*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:123*

___
<a id="use"></a>

###  use

**● use**: *`ApplicationRequestHandler`<`this`>*

*Inherited from Application.use*

*Overrides IRouter.use*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:1032*

___
<a id="defaultmaxlisteners"></a>

### `<Static>` defaultMaxListeners

**● defaultMaxListeners**: *`number`*

*Inherited from EventEmitter.defaultMaxListeners*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/events.d.ts:8*

___

## Methods

<a id="addlistener"></a>

###  addListener

▸ **addListener**(event: *`string` \| `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.addListener*

*Overrides EventEmitter.addListener*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/events.d.ts:10*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |
| listener | `function` |

**Returns:** `this`

___
<a id="defaultconfiguration"></a>

###  defaultConfiguration

▸ **defaultConfiguration**(): `void`

*Inherited from Application.defaultConfiguration*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:871*

Initialize application configuration.

**Returns:** `void`

___
<a id="disable"></a>

###  disable

▸ **disable**(setting: *`string`*): `Application`

*Inherited from Application.disable*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:967*

Disable `setting`.

**Parameters:**

| Name | Type |
| ------ | ------ |
| setting | `string` |

**Returns:** `Application`

___
<a id="disabled"></a>

###  disabled

▸ **disabled**(setting: *`string`*): `boolean`

*Inherited from Application.disabled*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:961*

Check if `setting` is disabled.

app.disabled('foo') // => true

app.enable('foo') app.disabled('foo') // => false

**Parameters:**

| Name | Type |
| ------ | ------ |
| setting | `string` |

**Returns:** `boolean`

___
<a id="emit"></a>

###  emit

▸ **emit**(event: *`string` \| `symbol`*, ...args: *`any`[]*): `boolean`

*Inherited from EventEmitter.emit*

*Overrides EventEmitter.emit*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/events.d.ts:22*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |
| `Rest` args | `any`[] |

**Returns:** `boolean`

___
<a id="enable"></a>

###  enable

▸ **enable**(setting: *`string`*): `Application`

*Inherited from Application.enable*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:964*

Enable `setting`.

**Parameters:**

| Name | Type |
| ------ | ------ |
| setting | `string` |

**Returns:** `Application`

___
<a id="enabled"></a>

###  enabled

▸ **enabled**(setting: *`string`*): `boolean`

*Inherited from Application.enabled*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:949*

Check if `setting` is enabled (truthy).

app.enabled('foo') // => false

app.enable('foo') app.enabled('foo') // => true

**Parameters:**

| Name | Type |
| ------ | ------ |
| setting | `string` |

**Returns:** `boolean`

___
<a id="engine"></a>

###  engine

▸ **engine**(ext: *`string`*, fn: *`function`*): `Application`

*Inherited from Application.engine*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:901*

Register the given template engine callback `fn` as `ext`.

By default will `require()` the engine based on the file extension. For example if you try to render a "foo.jade" file Express will invoke the following internally:

```
app.engine('jade', require('jade').__express);
```

For engines that do not provide `.__express` out of the box, or if you wish to "map" a different extension to the template engine you may use this method. For example mapping the EJS template engine to ".html" files:

```
app.engine('html', require('ejs').renderFile);
```

In this case EJS provides a `.renderFile()` method with the same signature that Express expects: `(path, options, callback)`, though note that it aliases this method as `ejs.__express` internally so if you're using ".ejs" extensions you dont need to do anything.

Some template engines do not follow this convention, the [Consolidate.js](https://github.com/visionmedia/consolidate.js) library was created to map all of node's popular template engines to follow this convention, thus allowing them to work seamlessly within Express.

**Parameters:**

| Name | Type |
| ------ | ------ |
| ext | `string` |
| fn | `function` |

**Returns:** `Application`

___
<a id="eventnames"></a>

###  eventNames

▸ **eventNames**(): `Array`<`string` \| `symbol`>

*Inherited from EventEmitter.eventNames*

*Overrides EventEmitter.eventNames*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/events.d.ts:23*

**Returns:** `Array`<`string` \| `symbol`>

___
<a id="getmaxlisteners"></a>

###  getMaxListeners

▸ **getMaxListeners**(): `number`

*Inherited from EventEmitter.getMaxListeners*

*Overrides EventEmitter.getMaxListeners*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/events.d.ts:19*

**Returns:** `number`

___
<a id="init"></a>

###  init

▸ **init**(): `void`

*Inherited from Application.init*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:866*

Initialize the server.

*   setup default configuration
*   setup default middleware
*   setup route reflection methods

**Returns:** `void`

___
<a id="listen"></a>

###  listen

▸ **listen**(port: *`number`*, hostname: *`string`*, backlog: *`number`*, callback?: *`undefined` \| `function`*): `Server`

▸ **listen**(port: *`number`*, hostname: *`string`*, callback?: *`undefined` \| `function`*): `Server`

▸ **listen**(port: *`number`*, callback?: *`undefined` \| `function`*): `Server`

▸ **listen**(callback?: *`undefined` \| `function`*): `Server`

▸ **listen**(path: *`string`*, callback?: *`undefined` \| `function`*): `Server`

▸ **listen**(handle: *`any`*, listeningListener?: *`undefined` \| `function`*): `Server`

*Inherited from Application.listen*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:1000*

Listen for connections.

A node `http.Server` is returned, with this application (which is a `Function`) as its callback. If you wish to create both an HTTP and HTTPS server you may do so with the "http" and "https" modules as shown here:

var http = require('http') , https = require('https') , express = require('express') , app = express();

http.createServer(app).listen(80); https.createServer({ ... }, app).listen(443);

**Parameters:**

| Name | Type |
| ------ | ------ |
| port | `number` |
| hostname | `string` |
| backlog | `number` |
| `Optional` callback | `undefined` \| `function` |

**Returns:** `Server`

*Inherited from Application.listen*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:1001*

**Parameters:**

| Name | Type |
| ------ | ------ |
| port | `number` |
| hostname | `string` |
| `Optional` callback | `undefined` \| `function` |

**Returns:** `Server`

*Inherited from Application.listen*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:1002*

**Parameters:**

| Name | Type |
| ------ | ------ |
| port | `number` |
| `Optional` callback | `undefined` \| `function` |

**Returns:** `Server`

*Inherited from Application.listen*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:1003*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` callback | `undefined` \| `function` |

**Returns:** `Server`

*Inherited from Application.listen*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:1004*

**Parameters:**

| Name | Type |
| ------ | ------ |
| path | `string` |
| `Optional` callback | `undefined` \| `function` |

**Returns:** `Server`

*Inherited from Application.listen*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:1005*

**Parameters:**

| Name | Type |
| ------ | ------ |
| handle | `any` |
| `Optional` listeningListener | `undefined` \| `function` |

**Returns:** `Server`

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
<a id="once"></a>

###  once

▸ **once**(event: *`string` \| `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.once*

*Overrides EventEmitter.once*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/events.d.ts:12*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |
| listener | `function` |

**Returns:** `this`

___
<a id="param"></a>

###  param

▸ **param**(name: *`string` \| `string`[]*, handler: *`RequestParamHandler`*): `this`

▸ **param**(callback: *`function`*): `this`

*Inherited from Application.param*

*Overrides IRouter.param*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:918*

**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` \| `string`[] |
| handler | `RequestParamHandler` |

**Returns:** `this`

*Inherited from Application.param*

*Overrides IRouter.param*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:925*

Alternatively, you can pass only a callback, in which case you have the opportunity to alter the app.param()

*__deprecated__*: since version 4.11

**Parameters:**

| Name | Type |
| ------ | ------ |
| callback | `function` |

**Returns:** `this`

___
<a id="path"></a>

###  path

▸ **path**(): `string`

*Inherited from Application.path*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:937*

Return the app's absolute pathname based on the parent(s) that have mounted it.

For example if the application was mounted as "/admin", which itself was mounted as "/blog" then the return value would be "/blog/admin".

**Returns:** `string`

___
<a id="prependlistener"></a>

###  prependListener

▸ **prependListener**(event: *`string` \| `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.prependListener*

*Overrides EventEmitter.prependListener*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/events.d.ts:13*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |
| listener | `function` |

**Returns:** `this`

___
<a id="prependoncelistener"></a>

###  prependOnceListener

▸ **prependOnceListener**(event: *`string` \| `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.prependOnceListener*

*Overrides EventEmitter.prependOnceListener*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/events.d.ts:14*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |
| listener | `function` |

**Returns:** `this`

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

▸ **removeListener**(event: *`string` \| `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.removeListener*

*Overrides EventEmitter.removeListener*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/node/events.d.ts:15*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |
| listener | `function` |

**Returns:** `this`

___
<a id="render"></a>

###  render

▸ **render**(name: *`string`*, options?: *`undefined` \| `object`*, callback?: *`undefined` \| `function`*): `void`

▸ **render**(name: *`string`*, callback: *`function`*): `void`

*Inherited from Application.render*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:980*

Render the given view `name` name with `options` and a callback accepting an error and the rendered template string.

Example:

app.render('email', { name: 'Tobi' }, function(err, html){ // ... })

**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |
| `Optional` options | `undefined` \| `object` |
| `Optional` callback | `undefined` \| `function` |

**Returns:** `void`

*Inherited from Application.render*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:981*

**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |
| callback | `function` |

**Returns:** `void`

___
<a id="route"></a>

###  route

▸ **route**(prefix: *`PathParams`*): `IRoute`

*Inherited from IRouter.route*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:127*

**Parameters:**

| Name | Type |
| ------ | ------ |
| prefix | `PathParams` |

**Returns:** `IRoute`

___
<a id="set"></a>

###  set

▸ **set**(setting: *`string`*, val: *`any`*): `Application`

*Inherited from Application.set*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/core/node_modules/@types/express-serve-static-core/index.d.ts:915*

Assign `setting` to `val`, or return `setting`'s value.

app.set('foo', 'bar'); app.get('foo'); // => "bar" app.set('foo', \['bar', 'baz'\]); app.get('foo'); // => \["bar", "baz"\]

Mounted servers inherit their parent server's settings.

**Parameters:**

| Name | Type |
| ------ | ------ |
| setting | `string` |
| val | `any` |

**Returns:** `Application`

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

