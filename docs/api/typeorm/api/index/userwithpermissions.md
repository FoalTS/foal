# Table of contents

* [UserWithPermissions][ClassDeclaration-0]
    * Methods
        * [hasPerm(codeName)][MethodDeclaration-0]
    * Properties
        * [id][PropertyDeclaration-0]
        * [groups][PropertyDeclaration-1]
        * [userPermissions][PropertyDeclaration-9]

# UserWithPermissions

Abstract class to define a user entity with a system of groups and permissions.

A group can have permissions.
A user can have permissions and belong to groups that have also permissions.

```typescript
abstract class UserWithPermissions
```
## Methods

### hasPerm(codeName)

Check if a user has a given permission. The user must have been retreived from the db
with their groups and permissions. Otherwise, the method will always return false.

```typescript
public hasPerm(codeName: string): boolean;
```

**Parameters**

| Name     | Type   | Description               |
| -------- | ------ | ------------------------- |
| codeName | string | - Name of the permission. |

**Return type**

boolean

## Properties

### id

```typescript
public id: number;
```

**Type**

number

----------

### groups

```typescript
public groups: Group[];
```

**Type**

[Group][ClassDeclaration-1][]

----------

### userPermissions

```typescript
public userPermissions: Permission[];
```

**Type**

[Permission][ClassDeclaration-2][]

[ClassDeclaration-0]: userwithpermissions.md#userwithpermissions
[MethodDeclaration-0]: userwithpermissions.md#haspermcodename
[PropertyDeclaration-0]: userwithpermissions.md#id
[PropertyDeclaration-1]: userwithpermissions.md#groups
[ClassDeclaration-1]: group.md#group
[PropertyDeclaration-9]: userwithpermissions.md#userpermissions
[ClassDeclaration-2]: permission.md#permission