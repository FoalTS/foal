[@foal/core](../README.md) > ["common/errors/permission-denied"](../modules/_common_errors_permission_denied_.md)

# External module: "common/errors/permission-denied"

## Index

### Classes

* [PermissionDenied](../classes/_common_errors_permission_denied_.permissiondenied.md)

### Functions

* [isPermissionDenied](_common_errors_permission_denied_.md#ispermissiondenied)

---

## Functions

<a id="ispermissiondenied"></a>

###  isPermissionDenied

▸ **isPermissionDenied**(err: *`object`*): `boolean`

*Defined in [common/errors/permission-denied.ts:30](https://github.com/FoalTS/foal/blob/cf326d07/packages/core/src/common/errors/permission-denied.ts#L30)*

Check if an error is an instance of PermissionDenied.

This function is a help when you have several packages using @foal/core. Npm can install the package several times, which leads to duplicate class definitions. If this is the case, the keyword `instanceof` may return false while the object is an instance of the class. This function fixes this problem.

*__export__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| err | `object` |  The error to check. |

**Returns:** `boolean`
True if the error is an instance of PermissionDenied. False otherwise.

___

