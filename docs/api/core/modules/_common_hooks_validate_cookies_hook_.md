[@foal/core](../README.md) > ["common/hooks/validate-cookies.hook"](../modules/_common_hooks_validate_cookies_hook_.md)

# External module: "common/hooks/validate-cookies.hook"

## Index

### Functions

* [ValidateCookies](_common_hooks_validate_cookies_hook_.md#validatecookies)

---

## Functions

<a id="validatecookies"></a>

###  ValidateCookies

▸ **ValidateCookies**(schema: *`object`*, options?: *`object`*): [HookDecorator](_core_hooks_.md#hookdecorator)

*Defined in [common/hooks/validate-cookies.hook.ts:15](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/common/hooks/validate-cookies.hook.ts#L15)*

Hook factory validating the cookies of the request against a AJV schema.

*__export__*: 

**Parameters:**

**schema: `object`**

Schema used to validate the cookies request.

**`Default value` options: `object`**

| Name | Type |
| ------ | ------ |
| `Optional` openapi | `undefined` \| `false` \| `true` |

**Returns:** [HookDecorator](_core_hooks_.md#hookdecorator)
*   The hook.

___

