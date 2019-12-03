[@foal/typeorm](../README.md) > ["entities/user-with-permissions.entity"](../modules/_entities_user_with_permissions_entity_.md) > [UserWithPermissions](../classes/_entities_user_with_permissions_entity_.userwithpermissions.md)

# Class: UserWithPermissions

Abstract class to define a user entity with a system of groups and permissions.

A group can have permissions. A user can have permissions and belong to groups that have also permissions.

*__export__*: 

*__abstract__*: 

*__class__*: UserWithPermissions

## Hierarchy

**UserWithPermissions**

## Index

### Properties

* [groups](_entities_user_with_permissions_entity_.userwithpermissions.md#groups)
* [id](_entities_user_with_permissions_entity_.userwithpermissions.md#id)
* [userPermissions](_entities_user_with_permissions_entity_.userwithpermissions.md#userpermissions)

### Methods

* [hasPerm](_entities_user_with_permissions_entity_.userwithpermissions.md#hasperm)

---

## Properties

<a id="groups"></a>

###  groups

**● groups**: *[Group](_entities_group_entity_.group.md)[]*

*Defined in [entities/user-with-permissions.entity.ts:25](https://github.com/FoalTS/foal/blob/70cc46bd/packages/typeorm/src/entities/user-with-permissions.entity.ts#L25)*

___
<a id="id"></a>

###  id

**● id**: *`number`*

*Defined in [entities/user-with-permissions.entity.ts:21](https://github.com/FoalTS/foal/blob/70cc46bd/packages/typeorm/src/entities/user-with-permissions.entity.ts#L21)*

___
<a id="userpermissions"></a>

###  userPermissions

**● userPermissions**: *[Permission](_entities_permission_entity_.permission.md)[]*

*Defined in [entities/user-with-permissions.entity.ts:29](https://github.com/FoalTS/foal/blob/70cc46bd/packages/typeorm/src/entities/user-with-permissions.entity.ts#L29)*

___

## Methods

<a id="hasperm"></a>

###  hasPerm

▸ **hasPerm**(codeName: *`string`*): `boolean`

*Defined in [entities/user-with-permissions.entity.ts:39](https://github.com/FoalTS/foal/blob/70cc46bd/packages/typeorm/src/entities/user-with-permissions.entity.ts#L39)*

Check if a user has a given permission. The user must have been retreived from the db with their groups and permissions. Otherwise, the method will always return false.

*__memberof__*: UserWithPermissions

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| codeName | `string` |  Name of the permission. |

**Returns:** `boolean`
True if the user has the permission. False otherwise.

___

