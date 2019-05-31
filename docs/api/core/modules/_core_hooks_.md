[@foal/core](../README.md) > ["core/hooks"](../modules/_core_hooks_.md)

# External module: "core/hooks"

## Index

### Type aliases

* [HookDecorator](_core_hooks_.md#hookdecorator)
* [HookFunction](_core_hooks_.md#hookfunction)
* [HookPostFunction](_core_hooks_.md#hookpostfunction)

### Functions

* [Hook](_core_hooks_.md#hook)
* [getHookFunction](_core_hooks_.md#gethookfunction)

---

## Type aliases

<a id="hookdecorator"></a>

###  HookDecorator

**Ƭ HookDecorator**: *`function`*

*Defined in [core/hooks.ts:29](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/core/hooks.ts#L29)*

Interface of a hook. It is actually the interface of a decorator.

*__export__*: 

#### Type declaration
▸(target: *`any`*, propertyKey?: *`undefined` \| `string`*): `any`

**Parameters:**

| Name | Type |
| ------ | ------ |
| target | `any` |
| `Optional` propertyKey | `undefined` \| `string` |

**Returns:** `any`

___
<a id="hookfunction"></a>

###  HookFunction

**Ƭ HookFunction**: *`function`*

*Defined in [core/hooks.ts:21](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/core/hooks.ts#L21)*

Interface of a function from which a hook can be created.

*__export__*: 

#### Type declaration
▸(ctx: *[Context](../classes/_core_http_contexts_.context.md)*, services: *[ServiceManager](../classes/_core_service_manager_.servicemanager.md)*): `void` \| [HttpResponse](../classes/_core_http_http_responses_.httpresponse.md) \| [HookPostFunction](_core_hooks_.md#hookpostfunction) \| `Promise`<`void` \| [HttpResponse](../classes/_core_http_http_responses_.httpresponse.md) \| [HookPostFunction](_core_hooks_.md#hookpostfunction)>

**Parameters:**

| Name | Type |
| ------ | ------ |
| ctx | [Context](../classes/_core_http_contexts_.context.md) |
| services | [ServiceManager](../classes/_core_service_manager_.servicemanager.md) |

**Returns:** `void` \| [HttpResponse](../classes/_core_http_http_responses_.httpresponse.md) \| [HookPostFunction](_core_hooks_.md#hookpostfunction) \| `Promise`<`void` \| [HttpResponse](../classes/_core_http_http_responses_.httpresponse.md) \| [HookPostFunction](_core_hooks_.md#hookpostfunction)>

___
<a id="hookpostfunction"></a>

###  HookPostFunction

**Ƭ HookPostFunction**: *`function`*

*Defined in [core/hooks.ts:14](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/core/hooks.ts#L14)*

Interface of a function that can be returned in a hook function. This function is then executed after the controller method execution.

*__export__*: 

#### Type declaration
▸(ctx: *[Context](../classes/_core_http_contexts_.context.md)*, services: *[ServiceManager](../classes/_core_service_manager_.servicemanager.md)*, response: *[HttpResponse](../classes/_core_http_http_responses_.httpresponse.md)*): `void` \| `Promise`<`void`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| ctx | [Context](../classes/_core_http_contexts_.context.md) |
| services | [ServiceManager](../classes/_core_service_manager_.servicemanager.md) |
| response | [HttpResponse](../classes/_core_http_http_responses_.httpresponse.md) |

**Returns:** `void` \| `Promise`<`void`>

___

## Functions

<a id="hook"></a>

###  Hook

▸ **Hook**(hookFunction: *[HookFunction](_core_hooks_.md#hookfunction)*): [HookDecorator](_core_hooks_.md#hookdecorator)

*Defined in [core/hooks.ts:38](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/core/hooks.ts#L38)*

Create a hook from a function.

*__export__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| hookFunction | [HookFunction](_core_hooks_.md#hookfunction) |  The function from which the hook should be created. |

**Returns:** [HookDecorator](_core_hooks_.md#hookdecorator)
- The hook decorator.

___
<a id="gethookfunction"></a>

###  getHookFunction

▸ **getHookFunction**(hook: *[HookDecorator](_core_hooks_.md#hookdecorator)*): [HookFunction](_core_hooks_.md#hookfunction)

*Defined in [core/hooks.ts:54](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/core/hooks.ts#L54)*

Get the function from which the hook was made.

*__export__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| hook | [HookDecorator](_core_hooks_.md#hookdecorator) |  The hook decorator. |

**Returns:** [HookFunction](_core_hooks_.md#hookfunction)
- The hook function.

___

