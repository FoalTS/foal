[@foal/core](../README.md) > ["common/errors/validation-error"](../modules/_common_errors_validation_error_.md)

# External module: "common/errors/validation-error"

## Index

### Classes

* [ValidationError](../classes/_common_errors_validation_error_.validationerror.md)

### Functions

* [isValidationError](_common_errors_validation_error_.md#isvalidationerror)

---

## Functions

<a id="isvalidationerror"></a>

###  isValidationError

▸ **isValidationError**(err: *`object`*): `boolean`

*Defined in [common/errors/validation-error.ts:30](https://github.com/FoalTS/foal/blob/538afb23/packages/core/src/common/errors/validation-error.ts#L30)*

Check if an error is an instance of ValidationError.

This function is a help when you have several packages using @foal/core. Npm can install the package several times, which leads to duplicate class definitions. If this is the case, the keyword `instanceof` may return false while the object is an instance of the class. This function fixes this problem.

*__export__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| err | `object` |  The error to check |

**Returns:** `boolean`
True if the error is an instance of ValidationError. False otherwise.

___

