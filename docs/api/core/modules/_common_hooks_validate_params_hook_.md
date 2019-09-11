[@foal/core](../README.md) > ["common/hooks/validate-params.hook"](../modules/_common_hooks_validate_params_hook_.md)

# External module: "common/hooks/validate-params.hook"

## Index

### Functions

* [ValidateParams](_common_hooks_validate_params_hook_.md#validateparams)

---

## Functions

<a id="validateparams"></a>

###  ValidateParams

▸ **ValidateParams**(schema: *`object`*, options?: *`object`*): [HookDecorator](_core_hooks_.md#hookdecorator)

*Defined in [common/hooks/validate-params.hook.ts:14](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/common/hooks/validate-params.hook.ts#L14)*

Hook factory validating the params of the request against a AJV schema.

*__export__*: 

**Parameters:**

**schema: `object`**

Schema used to validate the params request.

**`Default value` options: `object`**

| Name | Type |
| ------ | ------ |
| `Optional` openapi | `undefined` \| `false` \| `true` |

**Returns:** [HookDecorator](_core_hooks_.md#hookdecorator)
*   The hook.

___

