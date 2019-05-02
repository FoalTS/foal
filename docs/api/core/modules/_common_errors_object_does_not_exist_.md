[@foal/core](../README.md) > ["common/errors/object-does-not-exist"](../modules/_common_errors_object_does_not_exist_.md)

# External module: "common/errors/object-does-not-exist"

## Index

### Classes

* [ObjectDoesNotExist](../classes/_common_errors_object_does_not_exist_.objectdoesnotexist.md)

### Functions

* [isObjectDoesNotExist](_common_errors_object_does_not_exist_.md#isobjectdoesnotexist)

---

## Functions

<a id="isobjectdoesnotexist"></a>

###  isObjectDoesNotExist

▸ **isObjectDoesNotExist**(err: *`object`*): `boolean`

*Defined in [common/errors/object-does-not-exist.ts:30](https://github.com/FoalTS/foal/blob/7934e4d7/packages/core/src/common/errors/object-does-not-exist.ts#L30)*

Check if an error is an instance of ObjectDoesNotExist.

This function is a help when you have several packages using @foal/core. Npm can install the package several times, which leads to duplicate class definitions. If this is the case, the keyword `instanceof` may return false while the object is an instance of the class. This function fixes this problem.

*__export__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| err | `object` |  The error to check. |

**Returns:** `boolean`
True if the error is an instance of ObjectDoesNotExist. False otherwise.

___

