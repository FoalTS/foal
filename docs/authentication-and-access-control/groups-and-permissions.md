# Groups and Permissions

In advanced applications, access control can be managed through permissions and groups.

A *permission* gives a user the right to perform a given action (such as accessing a route).

A *group* brings together a set of users (a user can belong to more than one group).

Permissions can be attached to a user or a group. Attaching a permission to a group is equivalent to attaching the permission to each of its users.

> Examples of *groups* are the "Free", "Pro" and "Enterprise" plans of a SaaS application. Depending of the price paid by the customers, they have access to certain features whose access are managed by *permissions*.

## Permissions

### The `Permission` Entity

| Property name | Type | Database Link |
| --- | --- | --- |
| id | number | Primary auto generated key |
| name | string | |
| codeName | string | Unique, Length: 100 |

### Creating Permissions Programmatically

```typescript
import { getManager, getRepository } from 'typeorm';

import { Permission } from './src/app/entities';

async function main() {
  const perm = new Permission();
  perm.codeName = 'secret-perm';
  perm.name = 'Permission to access the secret';
  await getManager().save(perm);
  // OR
  await getManager().save(Permission, {
    codeName: 'secret-perm',
    name: 'Permission to access the secret'
  });
  // OR
  await getRepository(Permission).save({
    codeName: 'secret-perm',
    name: 'Permission to access the secret'
  });
}
```

### Creating Permissions with a Shell Script (CLI)

```sh
npm run build:scripts
foal run create-perm name="Permission to access the secret" codeName="access-secret"
```

## Groups

Groups are used to categorize users. A user can belong to several groups and a group can have several users.

A group can have permissions. They then apply to all its users.

### The Group Entity

| Property name | Type | Database Link |
| --- | --- | --- |
| id | number | Primary auto generated key |
| name | string | Length: 80 |
| codeName | string | Unique, Length: 100 |
| permissions | Permission[] | A many-to-many relation with the table permission |

### Creating Groups Programmatically

```typescript
import { getManager, getRepository } from 'typeorm';

import { Group, Permission } from './src/app/entities';

async function main() {
  const perm = new Permission();
  perm.codeName = 'delete-users';
  perm.name = 'Permission to delete users';
  await getManager().save(perm);

  const group = new Group();
  group.codeName = 'admin';
  group.name = 'Administrators';
  group.permissions = [ perm ];
  await getManager().save(group);
  // OR
  await getManager().save(Group, {
    codeName: 'admin',
    name: 'Administrators',
    permissions: [ perm ],
  });
  // OR
  await getRepository(Group).save({
    codeName: 'admin',
    name: 'Administrators',
    permissions: [ perm ],
  });
}
```

### Creating Groups with a Shell Script (CLI)

```sh
npm run build:scripts
foal run create-perm name="Permission to delete users" codeName="delete-users"
foal run create-group name="Administrators" codeName="admin" permissions='[ "delete-users" ]'
```

## Users

### The `UserWithPermissions` Entity

```typescript
import { UserWithPermissions } from '@foal/typeorm';
import { Entity } from 'typeorm';

@Entity()
export class User extends UserWithPermissions {

}
```

`UserWithPermissions` is an abstract class that has useful features to handle access control through permissions and groups. You must extend your `User` entity from this class to use permissions and groups.

| Property name | Type | Database Link |
| --- | --- | --- |
| id | number | Primary auto generated key |
| groups | Group[] | A many-to-many relation with the table group |
| userPermissions | Permission[] | A many-to-many relation with the table permission |

![Relations between Users, Groups and Permissions](./permissions-groups-and-users.png)

### The `hasPerm` Method

The `hasPerm(permissionCodeName: string)` method of the `UserWithPermissions` class returns true if one of these conditions is true:
- The user has the required permission.
- The user belongs to a group that has the required permission.

### Creating Users with Groups and Permissions with a Shell Script (CLI)

```sh
npm run build:scripts
foal run create-user userPermissions='[ "my-first-perm" ]' groups='[ "my-group" ]'
```

## Fetching a User with their Permissions

If you want the `hasPerm` method to work on the context `user` property, you must use the `fetchUserWithPermissions` function in the authentication hook.

*Example with JWT*
```typescript
import { Get } from '@foal/core';
import { JWTRequired } from '@foal/jwt';
import { fetchUserWithPermissions } from '@foal/typeorm';

@JWTRequired({ user: fetchUserWithPermissions(User) })
export class ProductController {
  @Get('/products')
  readProduct(ctx) {
    if (!ctx.user.hasPerm('read-products')) {
      return new HttpResponseForbidden();
    }
    return new HttpResponseOK([]);
  }
}
```

*Example with sessions and sookies*
```typescript
import { Get, LoginRequired } from '@foal/core';
import { fetchUserWithPermissions } from '@foal/typeorm';

@LoginRequired({ user: fetchUserWithPermissions(User) })
export class ProductController {
  @Get('/products')
  readProduct(ctx) {
    if (!ctx.user.hasPerm('read-products')) {
      return new HttpResponseForbidden();
    }
    return new HttpResponseOK([]);
  }
}
```

## The PermissionRequired Hook

The `PermissionRequired(perm: string, options: { redirect?: string } = {})` hook:
- returns a `401 Unauthorized` if no user is authenticated and `options.redirect` is undefined,
- redirects the page to the given path if no user is authenticated and  `options.redirect` is defined,
- returns a `403 Forbidden` if the user does not have the given permission. The `perm` argument is the `codeName` of the permission.

*Example*
```typescript
import { Get, LoginRequired } from '@foal/core';
import { fetchUserWithPermissions, PermissionRequired } from '@foal/typeorm';

@LoginRequired({ user: fetchUserWithPermissions(User) })
export class ProductController {
  @Get('/products')
  @PermissionRequired('read-products')
  readProduct(ctx) {
    return new HttpResponseOK([]);
  }
}
```