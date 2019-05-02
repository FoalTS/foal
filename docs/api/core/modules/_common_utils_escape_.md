[@foal/core](../README.md) > ["common/utils/escape"](../modules/_common_utils_escape_.md)

# External module: "common/utils/escape"

## Index

### Functions

* [escape](_common_utils_escape_.md#escape)

### Object literals

* [escapeMap](_common_utils_escape_.md#escapemap)

---

## Functions

<a id="escape"></a>

###  escape

▸ **escape**(str: *`string`*): `string`

*Defined in [common/utils/escape.ts:20](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/common/utils/escape.ts#L20)*

Escape a string following OWASP recommandations to prevent XSS attacks.

Source: [https://github.com/OWASP/CheatSheetSeries/blob/master/](https://github.com/OWASP/CheatSheetSeries/blob/master/) cheatsheets/Cross\_Site\_Scripting\_Prevention\_Cheat\_Sheet.md

*__export__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| str | `string` |  The string to escape. |

**Returns:** `string`
The escaped string.

___

## Object literals

<a id="escapemap"></a>

### `<Const>` escapeMap

**escapeMap**: *`object`*

*Defined in [common/utils/escape.ts:1](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/common/utils/escape.ts#L1)*

<a id="escapemap._"></a>

####  &quot;

**● &quot;**: *`string`* = "&quot;"

*Defined in [common/utils/escape.ts:2](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/common/utils/escape.ts#L2)*

___
<a id="escapemap._-1"></a>

####  &amp;

**● &amp;**: *`string`* = "&amp;"

*Defined in [common/utils/escape.ts:3](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/common/utils/escape.ts#L3)*

___
<a id="escapemap._-2"></a>

####  &#x27;

**● &#x27;**: *`string`* = "&#x27;"

*Defined in [common/utils/escape.ts:4](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/common/utils/escape.ts#L4)*

___
<a id="escapemap._-3"></a>

####  /

**● /**: *`string`* = "&#x2F;"

*Defined in [common/utils/escape.ts:5](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/common/utils/escape.ts#L5)*

___
<a id="escapemap._-4"></a>

####  &lt;

**● &lt;**: *`string`* = "&lt;"

*Defined in [common/utils/escape.ts:6](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/common/utils/escape.ts#L6)*

___
<a id="escapemap._-5"></a>

####  &gt;

**● &gt;**: *`string`* = "&gt;"

*Defined in [common/utils/escape.ts:7](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/common/utils/escape.ts#L7)*

___

___

