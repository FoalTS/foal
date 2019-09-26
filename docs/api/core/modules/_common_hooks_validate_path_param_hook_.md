[@foal/core](../README.md) > ["common/hooks/validate-path-param.hook"](../modules/_common_hooks_validate_path_param_hook_.md)

# External module: "common/hooks/validate-path-param.hook"

## Index

### Functions

* [ValidatePathParam](_common_hooks_validate_path_param_hook_.md#validatepathparam)

---

## Functions

<a id="validatepathparam"></a>

###  ValidatePathParam

▸ **ValidatePathParam**(name: *`string`*, schema: *`object` \| `function`*, options?: *`object`*): [HookDecorator](_core_hooks_.md#hookdecorator)

*Defined in [common/hooks/validate-path-param.hook.ts:18](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/common/hooks/validate-path-param.hook.ts#L18)*

Hook - Validate a specific path parameter against an AJV schema.

*__export__*: 

**Parameters:**

**name: `string`**

Path parameter name.

**schema: `object` \| `function`**

Schema used to validate the path parameter.

**`Default value` options: `object`**

| Name | Type |
| ------ | ------ |
| `Optional` openapi | `undefined` \| `false` \| `true` |

**Returns:** [HookDecorator](_core_hooks_.md#hookdecorator)
The hook.

___

