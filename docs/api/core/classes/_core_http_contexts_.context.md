[@foal/core](../README.md) > ["core/http/contexts"](../modules/_core_http_contexts_.md) > [Context](../classes/_core_http_contexts_.context.md)

# Class: Context

Class instantiated on each request. It includes:

*   the express request object,
*   the user object if available,
*   and a `state` object that can be used to pass data across several hooks.

*__export__*: 

*__class__*: Context

*__template__*: User

## Type parameters
#### User 
## Hierarchy

**Context**

## Index

### Constructors

* [constructor](_core_http_contexts_.context.md#constructor)

### Properties

* [request](_core_http_contexts_.context.md#request)
* [state](_core_http_contexts_.context.md#state)
* [user](_core_http_contexts_.context.md#user)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Context**(request: *`any`*): [Context](_core_http_contexts_.context.md)

*Defined in [core/http/contexts.ts:29](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/core/http/contexts.ts#L29)*

Creates an instance of Context.

*__memberof__*: Context

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| request | `any` |  Either the express request object or a mock (for testing). |

**Returns:** [Context](_core_http_contexts_.context.md)

___

## Properties

<a id="request"></a>

###  request

**● request**: *[HTTPRequest](../interfaces/_core_http_contexts_.httprequest.md)*

*Defined in [core/http/contexts.ts:29](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/core/http/contexts.ts#L29)*

___
<a id="state"></a>

###  state

**● state**: *`object`*

*Defined in [core/http/contexts.ts:27](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/core/http/contexts.ts#L27)*

#### Type declaration

[key: `string`]: `any`

___
<a id="user"></a>

###  user

**● user**: *`User`*

*Defined in [core/http/contexts.ts:28](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/core/http/contexts.ts#L28)*

___

