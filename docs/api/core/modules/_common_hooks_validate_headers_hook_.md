[@foal/core](../README.md) > ["common/hooks/validate-headers.hook"](../modules/_common_hooks_validate_headers_hook_.md)

# External module: "common/hooks/validate-headers.hook"

## Index

### Functions

* [ValidateHeaders](_common_hooks_validate_headers_hook_.md#validateheaders)

---

## Functions

<a id="validateheaders"></a>

###  ValidateHeaders

▸ **ValidateHeaders**(schema: *`object`*, options?: *`object`*): [HookDecorator](_core_hooks_.md#hookdecorator)

*Defined in [common/hooks/validate-headers.hook.ts:15](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/common/hooks/validate-headers.hook.ts#L15)*

Hook factory validating the headers of the request against a AJV schema.

*__export__*: 

**Parameters:**

**schema: `object`**

Schema used to validate the headers request.

**`Default value` options: `object`**

| Name | Type |
| ------ | ------ |
| `Optional` openapi | `undefined` \| `false` \| `true` |

**Returns:** [HookDecorator](_core_hooks_.md#hookdecorator)
- The hook.

___

