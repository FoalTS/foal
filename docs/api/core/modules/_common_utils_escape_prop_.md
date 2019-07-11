[@foal/core](../README.md) > ["common/utils/escape-prop"](../modules/_common_utils_escape_prop_.md)

# External module: "common/utils/escape-prop"

## Index

### Functions

* [escapeProp](_common_utils_escape_prop_.md#escapeprop)

---

## Functions

<a id="escapeprop"></a>

###  escapeProp

▸ **escapeProp**(object: *`object`*, propName: *`string`*): `void`

*Defined in [common/utils/escape-prop.ts:13](https://github.com/FoalTS/foal/blob/07f00115/packages/core/src/common/utils/escape-prop.ts#L13)*

Escape a string property of an object following OWASP recommandations to prevent XSS attacks.

Source: [https://github.com/OWASP/CheatSheetSeries/blob/master/](https://github.com/OWASP/CheatSheetSeries/blob/master/) cheatsheets/Cross\_Site\_Scripting\_Prevention\_Cheat\_Sheet.md

*__export__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| object | `object` |  The object which contains the property to escape. |
| propName | `string` |  The property name. |

**Returns:** `void`

___

