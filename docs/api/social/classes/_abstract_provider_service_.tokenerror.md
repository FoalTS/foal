[@foal/social](../README.md) > ["abstract-provider.service"](../modules/_abstract_provider_service_.md) > [TokenError](../classes/_abstract_provider_service_.tokenerror.md)

# Class: TokenError

Error thrown if the token endpoint does not return a 2xx response.

*__export__*: 

*__class__*: TokenError

*__extends__*: {Error}

## Hierarchy

 `Error`

**↳ TokenError**

## Index

### Constructors

* [constructor](_abstract_provider_service_.tokenerror.md#constructor)

### Properties

* [error](_abstract_provider_service_.tokenerror.md#error)
* [message](_abstract_provider_service_.tokenerror.md#message)
* [name](_abstract_provider_service_.tokenerror.md#name)
* [stack](_abstract_provider_service_.tokenerror.md#stack)
* [Error](_abstract_provider_service_.tokenerror.md#error-1)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new TokenError**(error: *`any`*): [TokenError](_abstract_provider_service_.tokenerror.md)

*Defined in [abstract-provider.service.ts:79](https://github.com/FoalTS/foal/blob/145b6b04/packages/social/src/abstract-provider.service.ts#L79)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| error | `any` |

**Returns:** [TokenError](_abstract_provider_service_.tokenerror.md)

___

## Properties

<a id="error"></a>

###  error

**● error**: *`any`*

*Defined in [abstract-provider.service.ts:81](https://github.com/FoalTS/foal/blob/145b6b04/packages/social/src/abstract-provider.service.ts#L81)*

___
<a id="message"></a>

###  message

**● message**: *`string`*

*Inherited from Error.message*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/social/node_modules/typedoc/node_modules/typescript/lib/lib.es5.d.ts:964*

___
<a id="name"></a>

###  name

**● name**: *"TokenError"* = "TokenError"

*Overrides Error.name*

*Defined in [abstract-provider.service.ts:79](https://github.com/FoalTS/foal/blob/145b6b04/packages/social/src/abstract-provider.service.ts#L79)*

___
<a id="stack"></a>

### `<Optional>` stack

**● stack**: *`undefined` \| `string`*

*Inherited from Error.stack*

*Overrides Error.stack*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/social/node_modules/typedoc/node_modules/typescript/lib/lib.es5.d.ts:965*

___
<a id="error-1"></a>

### `<Static>` Error

**● Error**: *`ErrorConstructor`*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/social/node_modules/typedoc/node_modules/typescript/lib/lib.es5.d.ts:974*

___

