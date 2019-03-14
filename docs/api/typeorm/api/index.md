# Table of contents

* [index.ts][SourceFile-0]
    * Functions
        * [PermissionRequired][FunctionDeclaration-0]
        * [fetchUserWithPermissions][FunctionDeclaration-1]
        * [fetchUser][FunctionDeclaration-2]

# index.ts

## Functions

### PermissionRequired

Hook factory to check if a user can access a route based on their permissions.

This function uses `UserWithPermissions.hasPerm` under the hood.  It is very likely
that you have to use the `fetchUserWithPermissions` function when using this hook.

```typescript
function PermissionRequired(perm: string, options: { redirect?: string | undefined; } = {}): HookDecorator;
```

**Parameters**

| Name    | Type                                    | Default value | Description                   |
| ------- | --------------------------------------- | ------------- | ----------------------------- |
| perm    | string                                  |               | - The name of the permission. |
| options | { redirect?: string &#124; undefined; } | {}            | - Hook options.               |

**Return type**

HookDecorator

----------

### fetchUserWithPermissions

Create a function that finds the first entity that matches some id. Groups and permissions
are also retreived so that `UserWithPermissions.hasPerm` and `PermissionRequired` can be used.

It returns undefined if no entity can be found.

This function is usually used by:
- LoginRequired (@foal/core)
- LoginOptional (@foal/core)
- JWTRequired (@foal/jwt)
- JWTOptional (@foal/jwt)

```typescript
function fetchUserWithPermissions(userEntityClass: Class<{ id: number | string; }>): (id: number | string) => Promise<any>;
```

**Parameters**

| Name            | Type                                 | Description                                               |
| --------------- | ------------------------------------ | --------------------------------------------------------- |
| userEntityClass | Class<{ id: number &#124; string; }> | - The entity class which must extend UserWithPermissions. |

**Return type**

(id: number | string) => Promise<any>

----------

### fetchUser

Create a function that finds the first entity that matches some id.

It returns undefined if no entity can be found.

This function is usually used by:
- LoginRequired (@foal/core)
- LoginOptional (@foal/core)
- JWTRequired (@foal/jwt)
- JWTOptional (@foal/jwt)

```typescript
function fetchUser(userEntityClass: Class<{ id: number | string; }>): (id: number | string) => Promise<any>;
```

**Parameters**

| Name            | Type                                 | Description         |
| --------------- | ------------------------------------ | ------------------- |
| userEntityClass | Class<{ id: number &#124; string; }> | - The entity class. |

**Return type**

(id: number | string) => Promise<any>

## Classes

### [UserWithPermissions][ClassDeclaration-0]

Abstract class to define a user entity with a system of groups and permissions.

A group can have permissions.
A user can have permissions and belong to groups that have also permissions.


----------

### [Group][ClassDeclaration-1]

Entity representing a group. A group can have permissions.


----------

### [Permission][ClassDeclaration-2]

Entity representing a permission.


[SourceFile-0]: index.md#indexts
[FunctionDeclaration-0]: index.md#permissionrequired
[FunctionDeclaration-1]: index.md#fetchuserwithpermissions
[FunctionDeclaration-2]: index.md#fetchuser
[ClassDeclaration-0]: index/userwithpermissions.md#userwithpermissions
[ClassDeclaration-1]: index/group.md#group
[ClassDeclaration-2]: index/permission.md#permission