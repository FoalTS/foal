[@foal/social](../README.md) > ["abstract-provider.service"](../modules/_abstract_provider_service_.md) > [AuthorizationError](../classes/_abstract_provider_service_.authorizationerror.md)

# Class: AuthorizationError

Error thrown if the authorization server returns an error.

*__export__*: 

*__class__*: AuthorizationError

*__extends__*: {Error}

## Hierarchy

 `Error`

**↳ AuthorizationError**

## Index

### Constructors

* [constructor](_abstract_provider_service_.authorizationerror.md#constructor)

### Properties

* [error](_abstract_provider_service_.authorizationerror.md#error)
* [errorDescription](_abstract_provider_service_.authorizationerror.md#errordescription)
* [errorUri](_abstract_provider_service_.authorizationerror.md#erroruri)
* [message](_abstract_provider_service_.authorizationerror.md#message)
* [name](_abstract_provider_service_.authorizationerror.md#name)
* [stack](_abstract_provider_service_.authorizationerror.md#stack)
* [Error](_abstract_provider_service_.authorizationerror.md#error-1)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new AuthorizationError**(error: *`string`*, errorDescription?: *`undefined` \| `string`*, errorUri?: *`undefined` \| `string`*): [AuthorizationError](_abstract_provider_service_.authorizationerror.md)

*Defined in [abstract-provider.service.ts:56](https://github.com/FoalTS/foal/blob/145b6b04/packages/social/src/abstract-provider.service.ts#L56)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| error | `string` |
| `Optional` errorDescription | `undefined` \| `string` |
| `Optional` errorUri | `undefined` \| `string` |

**Returns:** [AuthorizationError](_abstract_provider_service_.authorizationerror.md)

___

## Properties

<a id="error"></a>

###  error

**● error**: *`string`*

*Defined in [abstract-provider.service.ts:58](https://github.com/FoalTS/foal/blob/145b6b04/packages/social/src/abstract-provider.service.ts#L58)*

___
<a id="errordescription"></a>

### `<Optional>` errorDescription

**● errorDescription**: *`undefined` \| `string`*

*Defined in [abstract-provider.service.ts:59](https://github.com/FoalTS/foal/blob/145b6b04/packages/social/src/abstract-provider.service.ts#L59)*

___
<a id="erroruri"></a>

### `<Optional>` errorUri

**● errorUri**: *`undefined` \| `string`*

*Defined in [abstract-provider.service.ts:60](https://github.com/FoalTS/foal/blob/145b6b04/packages/social/src/abstract-provider.service.ts#L60)*

___
<a id="message"></a>

###  message

**● message**: *`string`*

*Inherited from Error.message*

*Defined in /Users/loicpoullain/projects/FoalTS/foal/packages/social/node_modules/typedoc/node_modules/typescript/lib/lib.es5.d.ts:964*

___
<a id="name"></a>

###  name

**● name**: *"AuthorizationError"* = "AuthorizationError"

*Overrides Error.name*

*Defined in [abstract-provider.service.ts:56](https://github.com/FoalTS/foal/blob/145b6b04/packages/social/src/abstract-provider.service.ts#L56)*

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

