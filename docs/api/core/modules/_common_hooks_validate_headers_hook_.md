[@foal/core](../README.md) > ["common/hooks/validate-headers.hook"](../modules/_common_hooks_validate_headers_hook_.md)

# External module: "common/hooks/validate-headers.hook"

## Index

### Functions

* [ValidateHeaders](_common_hooks_validate_headers_hook_.md#validateheaders)

---

## Functions

<a id="validateheaders"></a>

###  ValidateHeaders

▸ **ValidateHeaders**(schema: *`object`*): [HookDecorator](_core_hooks_.md#hookdecorator)

*Defined in [common/hooks/validate-headers.hook.ts:13](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/common/hooks/validate-headers.hook.ts#L13)*

Hook factory validating the headers of the request against a AJV schema.

*__export__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| schema | `object` |  Schema used to validate the headers request. |

**Returns:** [HookDecorator](_core_hooks_.md#hookdecorator)
- The hook.

___

