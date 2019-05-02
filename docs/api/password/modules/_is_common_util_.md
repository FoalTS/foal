[@foal/password](../README.md) > ["is-common.util"](../modules/_is_common_util_.md)

# External module: "is-common.util"

## Index

### Variables

* [list](_is_common_util_.md#list)

### Functions

* [isCommon](_is_common_util_.md#iscommon)

---

## Variables

<a id="list"></a>

### `<Let>` list

**● list**: *`string`[]*

*Defined in [is-common.util.ts:7](https://github.com/FoalTS/foal/blob/7934e4d7/packages/password/src/is-common.util.ts#L7)*

___

## Functions

<a id="iscommon"></a>

###  isCommon

▸ **isCommon**(password: *`string`*): `Promise`<`boolean`>

*Defined in [is-common.util.ts:16](https://github.com/FoalTS/foal/blob/7934e4d7/packages/password/src/is-common.util.ts#L16)*

Test if a password belongs to a list of 10k common passwords.

*__export__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| password | `string` |  The password to test. |

**Returns:** `Promise`<`boolean`>
- True if the password is found in the list. False otherwise.

___

