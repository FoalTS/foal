# Table of contents

* [UserWithPermissions][ClassDeclaration-0]
    * Methods
        * [hasPerm(codeName)][MethodDeclaration-0]
    * Properties
        * [id][PropertyDeclaration-0]
        * [groups][PropertyDeclaration-1]
        * [userPermissions][PropertyDeclaration-9]

# UserWithPermissions

```typescript
abstract class UserWithPermissions
```
## Methods

### hasPerm(codeName)

```typescript
public hasPerm(codeName: string): boolean;
```

**Parameters**

| Name     | Type   |
| -------- | ------ |
| codeName | string |

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