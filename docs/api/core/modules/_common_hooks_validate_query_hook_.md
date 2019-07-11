[@foal/core](../README.md) > ["common/hooks/validate-query.hook"](../modules/_common_hooks_validate_query_hook_.md)

# External module: "common/hooks/validate-query.hook"

## Index

### Functions

* [ValidateQuery](_common_hooks_validate_query_hook_.md#validatequery)

---

## Functions

<a id="validatequery"></a>

###  ValidateQuery

▸ **ValidateQuery**(schema: *`object`*, options?: *`object`*): [HookDecorator](_core_hooks_.md#hookdecorator)

*Defined in [common/hooks/validate-query.hook.ts:14](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/common/hooks/validate-query.hook.ts#L14)*

Hook factory validating the query of the request against a AJV schema.

*__export__*: 

**Parameters:**

**schema: `object`**

Schema used to validate the query request.

**`Default value` options: `object`**

| Name | Type |
| ------ | ------ |
| `Optional` openapi | `undefined` \| `false` \| `true` |

**Returns:** [HookDecorator](_core_hooks_.md#hookdecorator)
- The hook.

___

