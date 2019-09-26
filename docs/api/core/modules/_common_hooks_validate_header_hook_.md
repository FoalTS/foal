[@foal/core](../README.md) > ["common/hooks/validate-header.hook"](../modules/_common_hooks_validate_header_hook_.md)

# External module: "common/hooks/validate-header.hook"

## Index

### Functions

* [ValidateHeader](_common_hooks_validate_header_hook_.md#validateheader)

---

## Functions

<a id="validateheader"></a>

###  ValidateHeader

▸ **ValidateHeader**(name: *`string`*, schema?: *`object` \| `function`*, options?: *`object`*): [HookDecorator](_core_hooks_.md#hookdecorator)

*Defined in [common/hooks/validate-header.hook.ts:19](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/common/hooks/validate-header.hook.ts#L19)*

Hook - Validate a specific header against an AJV schema.

*__export__*: 

**Parameters:**

**name: `string`**

Header name.

**`Default value` schema: `object` \| `function`**

**`Default value` options: `object`**

| Name | Type |
| ------ | ------ |
| `Optional` openapi | `undefined` \| `false` \| `true` |
| `Optional` required | `undefined` \| `false` \| `true` |

**Returns:** [HookDecorator](_core_hooks_.md#hookdecorator)
The hook.

___

