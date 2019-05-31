[@foal/core](../README.md) > ["common/hooks/validate-cookies.hook"](../modules/_common_hooks_validate_cookies_hook_.md)

# External module: "common/hooks/validate-cookies.hook"

## Index

### Functions

* [ValidateCookies](_common_hooks_validate_cookies_hook_.md#validatecookies)

---

## Functions

<a id="validatecookies"></a>

###  ValidateCookies

▸ **ValidateCookies**(schema: *`object`*): [HookDecorator](_core_hooks_.md#hookdecorator)

*Defined in [common/hooks/validate-cookies.hook.ts:13](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/common/hooks/validate-cookies.hook.ts#L13)*

Hook factory validating the cookies of the request against a AJV schema.

*__export__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| schema | `object` |  Schema used to validate the cookies request. |

**Returns:** [HookDecorator](_core_hooks_.md#hookdecorator)
- The hook.

___

