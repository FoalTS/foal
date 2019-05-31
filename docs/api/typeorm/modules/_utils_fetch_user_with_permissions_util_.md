[@foal/typeorm](../README.md) > ["utils/fetch-user-with-permissions.util"](../modules/_utils_fetch_user_with_permissions_util_.md)

# External module: "utils/fetch-user-with-permissions.util"

## Index

### Functions

* [fetchUserWithPermissions](_utils_fetch_user_with_permissions_util_.md#fetchuserwithpermissions)

---

## Functions

<a id="fetchuserwithpermissions"></a>

###  fetchUserWithPermissions

▸ **fetchUserWithPermissions**(userEntityClass: *`Class`<`object`>*): `function`

*Defined in [utils/fetch-user-with-permissions.util.ts:21](https://github.com/FoalTS/foal/blob/cf326d07/packages/typeorm/src/utils/fetch-user-with-permissions.util.ts#L21)*

Create a function that finds the first entity that matches some id. Groups and permissions are also retreived so that `UserWithPermissions.hasPerm` and `PermissionRequired` can be used.

It returns undefined if no entity can be found.

This function is usually used by:

*   LoginRequired (@foal/core)
*   LoginOptional (@foal/core)
*   JWTRequired (@foal/jwt)
*   JWTOptional (@foal/jwt)

*__export__*: 

**Parameters:**

| Name | Type |
| ------ | ------ |
| userEntityClass | `Class`<`object`> |

**Returns:** `function`
The returned function expecting an id.

___

