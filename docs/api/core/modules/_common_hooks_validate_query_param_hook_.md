[@foal/core](../README.md) > ["common/hooks/validate-query-param.hook"](../modules/_common_hooks_validate_query_param_hook_.md)

# External module: "common/hooks/validate-query-param.hook"

## Index

### Functions

* [ValidateQueryParam](_common_hooks_validate_query_param_hook_.md#validatequeryparam)

---

## Functions

<a id="validatequeryparam"></a>

###  ValidateQueryParam

▸ **ValidateQueryParam**(name: *`string`*, schema?: *`object` \| `function`*, options?: *`object`*): [HookDecorator](_core_hooks_.md#hookdecorator)

*Defined in [common/hooks/validate-query-param.hook.ts:19](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/common/hooks/validate-query-param.hook.ts#L19)*

Hook - Validate a specific query parameter against an AJV schema.

*__export__*: 

**Parameters:**

**name: `string`**

Query parameter name.

**`Default value` schema: `object` \| `function`**

**`Default value` options: `object`**

| Name | Type |
| ------ | ------ |
| `Optional` openapi | `undefined` \| `false` \| `true` |
| `Optional` required | `undefined` \| `false` \| `true` |

**Returns:** [HookDecorator](_core_hooks_.md#hookdecorator)
The hook.

___

