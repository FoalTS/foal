[@foal/core](../README.md) > ["common/hooks/validate-query.hook"](../modules/_common_hooks_validate_query_hook_.md)

# External module: "common/hooks/validate-query.hook"

## Index

### Functions

* [ValidateQuery](_common_hooks_validate_query_hook_.md#validatequery)

---

## Functions

<a id="validatequery"></a>

###  ValidateQuery

▸ **ValidateQuery**(schema: *`object`*): [HookDecorator](_core_hooks_.md#hookdecorator)

*Defined in [common/hooks/validate-query.hook.ts:13](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/common/hooks/validate-query.hook.ts#L13)*

Hook factory validating the query of the request against a AJV schema.

*__export__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| schema | `object` |  Schema used to validate the query request. |

**Returns:** [HookDecorator](_core_hooks_.md#hookdecorator)
- The hook.

___

