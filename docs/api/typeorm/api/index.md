# Table of contents

* [index.ts][SourceFile-0]
    * Functions
        * [PermissionRequired][FunctionDeclaration-0]
        * [fetchUserWithPermissions][FunctionDeclaration-1]
        * [fetchUser][FunctionDeclaration-2]
    * Interfaces
        * [EmailUser][InterfaceDeclaration-0]
    * Types
        * [Middleware][TypeAliasDeclaration-0]
        * [RelationLoader][TypeAliasDeclaration-1]
    * Variables
        * [emailSchema][VariableDeclaration-0]

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

## Interfaces

### EmailUser

**Warning Beta!**

Deprecated!</span>

```typescript
interface EmailUser extends UserWithPermissions {
    email: string;
    password: string;
}
```

**Extends**

[UserWithPermissions][ClassDeclaration-0]

**Properties**

| Name     | Type   | Optional |
| -------- | ------ | -------- |
| email    | string | false    |
| password | string | false    |

## Types

### Middleware

**Warning Beta!**

Deprecated!</span>

```typescript
type Middleware = (context: { user: any; resource: any; data: any; params: CollectionParams; }) => any;
```

**Type**

(context: { user: any; resource: any; data: any; params: CollectionParams; }) => any

----------

### RelationLoader

**Warning Beta!**

Deprecated!</span>

```typescript
type RelationLoader = (user: any, params: CollectionParams) => string[];
```

**Type**

(user: any, params: CollectionParams) => string[]

## Classes

### [EmailAuthenticator][ClassDeclaration-3]

**Warning Beta!**

Deprecated!</span>

Authenticator with email and password.


----------

### [EntityResourceCollection][ClassDeclaration-4]

**Warning Beta!**

Deprecated!</span>

Create, read, update or delete entities and return representations
of them.


----------

### [UserWithPermissions][ClassDeclaration-0]


----------

### [Group][ClassDeclaration-1]


----------

### [Permission][ClassDeclaration-2]


## Variables

### emailSchema

**Warning Beta!**

Deprecated!</span>

```typescript
const emailSchema: { additionalProperties: boolean; properties: { email: { type: string; format: string; }; password: { type: string; }; }; required: string[]; type: string; };
```

**Type**

{ additionalProperties: boolean; properties: { email: { type: string; format: string; }; password: { type: string; }; }; required: string[]; type: string; }

[SourceFile-0]: index.md#indexts
[FunctionDeclaration-0]: index.md#permissionrequired
[FunctionDeclaration-1]: index.md#fetchuserwithpermissions
[FunctionDeclaration-2]: index.md#fetchuser
[InterfaceDeclaration-0]: index.md#emailuser
[ClassDeclaration-0]: index/userwithpermissions.md#userwithpermissions
[TypeAliasDeclaration-0]: index.md#middleware
[TypeAliasDeclaration-1]: index.md#relationloader
[ClassDeclaration-3]: index/emailauthenticator.md#emailauthenticator
[ClassDeclaration-4]: index/entityresourcecollection.md#entityresourcecollection
[ClassDeclaration-0]: index/userwithpermissions.md#userwithpermissions
[ClassDeclaration-1]: index/group.md#group
[ClassDeclaration-2]: index/permission.md#permission
[VariableDeclaration-0]: index.md#emailschema