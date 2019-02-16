# Table of contents

* [index.ts][SourceFile-0]
    * Functions
        * [PermissionRequired][FunctionDeclaration-0]
        * [fetchUserWithPermissions][FunctionDeclaration-1]
        * [fetchUser][FunctionDeclaration-2]

# index.ts

## Functions

### PermissionRequired

```typescript
function PermissionRequired(perm: string, options: { redirect?: string | undefined; } = {}): HookDecorator;
```

**Parameters**

| Name    | Type                                    | Default value |
| ------- | --------------------------------------- | ------------- |
| perm    | string                                  |               |
| options | { redirect?: string &#124; undefined; } | {}            |

**Return type**

HookDecorator

----------

### fetchUserWithPermissions

```typescript
function fetchUserWithPermissions(userEntityClass: Class<{ id: number | string; }>): (id: number | string) => Promise<any>;
```

**Parameters**

| Name            | Type                                 |
| --------------- | ------------------------------------ |
| userEntityClass | Class<{ id: number &#124; string; }> |

**Return type**

(id: number | string) => Promise<any>

----------

### fetchUser

```typescript
function fetchUser(userEntityClass: Class<{ id: number | string; }>): (id: number | string) => Promise<any>;
```

**Parameters**

| Name            | Type                                 |
| --------------- | ------------------------------------ |
| userEntityClass | Class<{ id: number &#124; string; }> |

**Return type**

(id: number | string) => Promise<any>

## Classes

### [UserWithPermissions][ClassDeclaration-0]


----------

### [Group][ClassDeclaration-1]


----------

### [Permission][ClassDeclaration-2]


[SourceFile-0]: index.md#indexts
[FunctionDeclaration-0]: index.md#permissionrequired
[FunctionDeclaration-1]: index.md#fetchuserwithpermissions
[FunctionDeclaration-2]: index.md#fetchuser
[ClassDeclaration-0]: index/userwithpermissions.md#userwithpermissions
[ClassDeclaration-1]: index/group.md#group
[ClassDeclaration-2]: index/permission.md#permission