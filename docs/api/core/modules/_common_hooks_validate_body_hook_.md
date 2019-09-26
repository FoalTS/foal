[@foal/core](../README.md) > ["common/hooks/validate-body.hook"](../modules/_common_hooks_validate_body_hook_.md)

# External module: "common/hooks/validate-body.hook"

## Index

### Functions

* [ValidateBody](_common_hooks_validate_body_hook_.md#validatebody)

---

## Functions

<a id="validatebody"></a>

###  ValidateBody

▸ **ValidateBody**(schema: *`object` \| `function`*, options?: *`object`*): [HookDecorator](_core_hooks_.md#hookdecorator)

*Defined in [common/hooks/validate-body.hook.ts:15](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/common/hooks/validate-body.hook.ts#L15)*

Hook factory validating the body of the request against a AJV schema.

*__export__*: 

**Parameters:**

**schema: `object` \| `function`**

Schema used to validate the body request.

**`Default value` options: `object`**

| Name | Type |
| ------ | ------ |
| `Optional` openapi | `undefined` \| `false` \| `true` |

**Returns:** [HookDecorator](_core_hooks_.md#hookdecorator)
*   The hook.

___

