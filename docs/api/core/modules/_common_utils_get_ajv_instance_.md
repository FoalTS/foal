[@foal/core](../README.md) > ["common/utils/get-ajv-instance"](../modules/_common_utils_get_ajv_instance_.md)

# External module: "common/utils/get-ajv-instance"

## Index

### Functions

* [getAjvInstance](_common_utils_get_ajv_instance_.md#getajvinstance)

### Object literals

* [_instanceWrapper](_common_utils_get_ajv_instance_.md#_instancewrapper)

---

## Functions

<a id="getajvinstance"></a>

###  getAjvInstance

▸ **getAjvInstance**(): `Ajv.Ajv`

*Defined in [common/utils/get-ajv-instance.ts:25](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/common/utils/get-ajv-instance.ts#L25)*

Return the Ajv instance used internally by FoalTS.

It has this default configuration:

*   coerceTypes: true (Change data type of data to match `type` keyword.)
*   removeAdditional: true (Remove additional properties when `additionalProperties` keyword is false.)
*   useDefaults: true (Replace missing properties and items with the values from corresponding `default` keyword)

This configuration can be overrided using the file `config/default.json` or through environment variables: SETTINGS\_AJV\_COERCE\_TYPES, SETTINGS\_AJV\_REMOVE\_ADDITIONAL, SETTINGS\_AJV\_USE\_DEFAULTS.

*__export__*: 

**Returns:** `Ajv.Ajv`
The AJV instance

___

## Object literals

<a id="_instancewrapper"></a>

### `<Const>` _instanceWrapper

**_instanceWrapper**: *`object`*

*Defined in [common/utils/get-ajv-instance.ts:7](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/common/utils/get-ajv-instance.ts#L7)*

<a id="_instancewrapper.instance"></a>

####  instance

**● instance**: *`null`* =  null

*Defined in [common/utils/get-ajv-instance.ts:8](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/common/utils/get-ajv-instance.ts#L8)*

___

___

