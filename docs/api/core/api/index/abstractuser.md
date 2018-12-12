# Table of contents

* [AbstractUser][ClassDeclaration-1]
    * Methods
        * [hasPerm(codeName)][MethodDeclaration-0]
    * Properties
        * [id][PropertyDeclaration-1]
        * [groups][PropertyDeclaration-2]
        * [userPermissions][PropertyDeclaration-10]

# AbstractUser

```typescript
abstract class AbstractUser
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

[Group][ClassDeclaration-2][]

----------

### userPermissions

```typescript
public userPermissions: Permission[];
```

**Type**

[Permission][ClassDeclaration-3][]

[ClassDeclaration-1]: abstractuser.md#abstractuser
[MethodDeclaration-0]: abstractuser.md#haspermcodename
[PropertyDeclaration-1]: abstractuser.md#id
[PropertyDeclaration-2]: abstractuser.md#groups
[ClassDeclaration-2]: group.md#group
[PropertyDeclaration-10]: abstractuser.md#userpermissions
[ClassDeclaration-3]: permission.md#permission