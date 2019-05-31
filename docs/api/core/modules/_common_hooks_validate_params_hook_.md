[@foal/core](../README.md) > ["common/hooks/validate-params.hook"](../modules/_common_hooks_validate_params_hook_.md)

# External module: "common/hooks/validate-params.hook"

## Index

### Functions

* [ValidateParams](_common_hooks_validate_params_hook_.md#validateparams)

---

## Functions

<a id="validateparams"></a>

###  ValidateParams

▸ **ValidateParams**(schema: *`object`*): [HookDecorator](_core_hooks_.md#hookdecorator)

*Defined in [common/hooks/validate-params.hook.ts:13](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/common/hooks/validate-params.hook.ts#L13)*

Hook factory validating the params of the request against a AJV schema.

*__export__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| schema | `object` |  Schema used to validate the params request. |

**Returns:** [HookDecorator](_core_hooks_.md#hookdecorator)
- The hook.

___

