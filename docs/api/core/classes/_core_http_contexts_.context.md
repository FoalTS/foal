[@foal/core](../README.md) > ["core/http/contexts"](../modules/_core_http_contexts_.md) > [Context](../classes/_core_http_contexts_.context.md)

# Class: Context

Class instantiated on each request. It includes:

*   the express request object,
*   the user object if available,
*   the session object if available,
*   and a `state` object that can be used to pass data across several hooks.

*__export__*: 

*__class__*: Context

*__template__*: User

## Type parameters
#### User 
#### ContextSession 
## Hierarchy

**Context**

## Index

### Constructors

* [constructor](_core_http_contexts_.context.md#constructor)

### Properties

* [request](_core_http_contexts_.context.md#request)
* [session](_core_http_contexts_.context.md#session)
* [state](_core_http_contexts_.context.md#state)
* [user](_core_http_contexts_.context.md#user)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Context**(request: *`any`*): [Context](_core_http_contexts_.context.md)

*Defined in [core/http/contexts.ts:19](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/core/http/contexts.ts#L19)*

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

**● request**: *`Request`*

*Defined in [core/http/contexts.ts:19](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/core/http/contexts.ts#L19)*

___
<a id="session"></a>

###  session

**● session**: *`ContextSession`*

*Defined in [core/http/contexts.ts:18](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/core/http/contexts.ts#L18)*

___
<a id="state"></a>

###  state

**● state**: *`object`*

*Defined in [core/http/contexts.ts:16](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/core/http/contexts.ts#L16)*

#### Type declaration

[key: `string`]: `any`

___
<a id="user"></a>

###  user

**● user**: *`User`*

*Defined in [core/http/contexts.ts:17](https://github.com/FoalTS/foal/blob/70cc46bd/packages/core/src/core/http/contexts.ts#L17)*

___

