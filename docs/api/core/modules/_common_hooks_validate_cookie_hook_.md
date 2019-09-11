[@foal/core](../README.md) > ["common/hooks/validate-cookie.hook"](../modules/_common_hooks_validate_cookie_hook_.md)

# External module: "common/hooks/validate-cookie.hook"

## Index

### Functions

* [ValidateCookie](_common_hooks_validate_cookie_hook_.md#validatecookie)

---

## Functions

<a id="validatecookie"></a>

###  ValidateCookie

▸ **ValidateCookie**(name: *`string`*, schema?: *`object` \| `function`*, options?: *`object`*): [HookDecorator](_core_hooks_.md#hookdecorator)

*Defined in [common/hooks/validate-cookie.hook.ts:19](https://github.com/FoalTS/foal/blob/aac11366/packages/core/src/common/hooks/validate-cookie.hook.ts#L19)*

Hook - Validate a specific cookie against an AJV schema.

*__export__*: 

**Parameters:**

**name: `string`**

Cookie name.

**`Default value` schema: `object` \| `function`**

**`Default value` options: `object`**

| Name | Type |
| ------ | ------ |
| `Optional` openapi | `undefined` \| `false` \| `true` |
| `Optional` required | `undefined` \| `false` \| `true` |

**Returns:** [HookDecorator](_core_hooks_.md#hookdecorator)
The hook.

___

