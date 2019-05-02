# @foal/typeorm

## Table of contents

* [index.ts](index-6.md#indexts)
  * Functions
    * [PermissionRequired](index-6.md#permissionrequired)
    * [fetchUserWithPermissions](index-6.md#fetchuserwithpermissions)
    * [fetchUser](index-6.md#fetchuser)

## index.ts

### Functions

#### PermissionRequired

Hook factory to check if a user can access a route based on their permissions.

This function uses `UserWithPermissions.hasPerm` under the hood. It is very likely that you have to use the `fetchUserWithPermissions` function when using this hook.

```typescript
function PermissionRequired(perm: string, options: { redirect?: string | undefined; } = {}): HookDecorator;
```

**Parameters**

| Name | Type | Default value | Description |
| :--- | :--- | :--- | :--- |
| perm | string |  | - The name of the permission. |
| options | { redirect?: string \| undefined; } | {} | - Hook options. |

**Return type**

HookDecorator

#### fetchUserWithPermissions

Create a function that finds the first entity that matches some id. Groups and permissions are also retreived so that `UserWithPermissions.hasPerm` and `PermissionRequired` can be used.

It returns undefined if no entity can be found.

This function is usually used by:

* LoginRequired \(@foal/core\)
* LoginOptional \(@foal/core\)
* JWTRequired \(@foal/jwt\)
* JWTOptional \(@foal/jwt\)

```typescript
function fetchUserWithPermissions(userEntityClass: Class<{ id: number | string; }>): (id: number | string) => Promise<any>;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| userEntityClass | Class&lt;{ id: number \| string; }&gt; | - The entity class which must extend UserWithPermissions. |

**Return type**

\(id: number \| string\) =&gt; Promise

#### fetchUser

Create a function that finds the first entity that matches some id.

It returns undefined if no entity can be found.

This function is usually used by:

* LoginRequired \(@foal/core\)
* LoginOptional \(@foal/core\)
* JWTRequired \(@foal/jwt\)
* JWTOptional \(@foal/jwt\)

```typescript
function fetchUser(userEntityClass: Class<{ id: number | string; }>): (id: number | string) => Promise<any>;
```

**Parameters**

| Name | Type | Description |
| :--- | :--- | :--- |
| userEntityClass | Class&lt;{ id: number \| string; }&gt; | - The entity class. |

**Return type**

\(id: number \| string\) =&gt; Promise

### Classes

#### [UserWithPermissions](https://github.com/FoalTS/foal/tree/8a1684e8c8554bf791c22800d1f92a136825a7d3/docs/api/typeorm/api/index/userwithpermissions.md#userwithpermissions)

Abstract class to define a user entity with a system of groups and permissions.

A group can have permissions. A user can have permissions and belong to groups that have also permissions.

#### [Group](https://github.com/FoalTS/foal/tree/8a1684e8c8554bf791c22800d1f92a136825a7d3/docs/api/typeorm/api/index/group.md#group)

Entity representing a group. A group can have permissions.

#### \[Permission\]\[ClassDeclaration-2\]

Entity representing a permission.

\[ClassDeclaration-2\]: index/permission.md\#permission

