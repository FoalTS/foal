[@foal/core](../README.md) > ["common/utils/validate.util"](../modules/_common_utils_validate_util_.md)

# External module: "common/utils/validate.util"

## Index

### Functions

* [validate](_common_utils_validate_util_.md#validate)

---

## Functions

<a id="validate"></a>

###  validate

▸ **validate**(schema: *`object`*, data: *`any`*): `void`

*Defined in [common/utils/validate.util.ts:13](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/common/utils/validate.util.ts#L13)*

Validate an object against an AJV schema. If the object is not validated, the function throws a ValidationError with the failure details.

*__export__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| schema | `object` |  The AJV schema. |
| data | `any` |  The tested data. |

**Returns:** `void`

___

