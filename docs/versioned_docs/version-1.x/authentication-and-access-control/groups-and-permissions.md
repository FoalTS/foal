---
title: Groups & Permissions
---

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

Create a new script with this command:
```
foal generate script create-perm
```

Replace the content of the new created file `src/scripts/create-perm.ts` with the following:
```typescript
// 3p
import { Permission } from '@foal/typeorm';
import { createConnection, getConnection, getManager } from 'typeorm';

export const schema = {
  additionalProperties: false,
  properties: {
    codeName: { type: 'string', maxLength: 100 },
    name: { type: 'string' },
  },
  required: [ 'name', 'codeName' ],
  type: 'object',
};

export async function main(args: { codeName: string, name: string }) {
  const permission = new Permission();
  permission.codeName = args.codeName;
  permission.name = args.name;

  await createConnection();

  try {
    console.log(
      await getManager().save(permission)
    );
  } catch (error) {
    console.log(error.message);
  } finally {
    await getConnection().close();
  }
}
```

Then you can create a permission through the command line.
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

Create a new script with this command:
```
foal generate script create-group
```

Replace the content of the new created file `src/scripts/create-group.ts` with the following:
```typescript
// 3p
import { Group, Permission } from '@foal/typeorm';
import { createConnection, getManager, getRepository } from 'typeorm';

export const schema = {
  additionalProperties: false,
  properties: {
    codeName: { type: 'string', maxLength: 100 },
    name: { type: 'string', maxLength: 80 },
    permissions: { type: 'array', items: { type: 'string' }, uniqueItems: true, default: [] }
  },
  required: [ 'name', 'codeName' ],
  type: 'object',
};

export async function main(args: { codeName: string, name: string, permissions: string[] }) {
  const group = new Group();
  group.permissions = [];
  group.codeName = args.codeName;
  group.name = args.name;

  const connection = await createConnection();
  try {
    for (const codeName of args.permissions) {
      const permission = await getRepository(Permission).findOne({ codeName });
      if (!permission) {
        console.log(
          `No permission with the code name "${codeName}" was found.`
        );
        return;
      }
      group.permissions.push(permission);
    }

    console.log(
      await getManager().save(group)
    );
  } catch (error) {
    console.log(error.message);
  } finally {
    await connection.close();
  }
}

```

Then you can create a group through the command line.
```sh
npm run build:scripts
foal run create-perm name="Permission to delete users" codeName="delete-users"
foal run create-group name="Administrators" codeName="admin" permissions="[ \"delete-users\" ]"
```

## Users

### The `UserWithPermissions` Entity

```typescript
import { UserWithPermissions } from '@foal/typeorm';
import { Entity } from 'typeorm';

@Entity()
export class User extends UserWithPermissions {

}

// You MUST export Group and Permission so that TypeORM can generate migrations.
export { Group, Permission } from '@foal/typeorm';
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

Uncomment the code in the file `src/scripts/create-user.ts`.

Then you can create a user with their permissions and groups through the command line.
```sh
npm run build:scripts
foal run create-user userPermissions="[ \"my-first-perm\" ]" groups="[ \"my-group\" ]"
```

## Fetching a User with their Permissions

If you want the `hasPerm` method to work on the context `user` property, you must use the `fetchUserWithPermissions` function in the authentication hook.

*Example with JSON Web Tokens*
```typescript
import { Context, Get } from '@foal/core';
import { JWTRequired } from '@foal/jwt';
import { fetchUserWithPermissions } from '@foal/typeorm';

@JWTRequired({
  user: fetchUserWithPermissions(User)
})
export class ProductController {
  @Get('/products')
  readProduct(ctx: Context) {
    if (!ctx.user.hasPerm('read-products')) {
      return new HttpResponseForbidden();
    }
    return new HttpResponseOK([]);
  }
}
```

*Example with Sessions Tokens*
```typescript
import { Context, Get, TokenRequired } from '@foal/core';
import { fetchUserWithPermissions, TypeORMStore } from '@foal/typeorm';

@TokenRequired({
  store: TypeORMStore,
  user: fetchUserWithPermissions(User)
})
export class ProductController {
  @Get('/products')
  readProduct(ctx: Context) {
    if (!ctx.user.hasPerm('read-products')) {
      return new HttpResponseForbidden();
    }
    return new HttpResponseOK([]);
  }
}
```

## The PermissionRequired Hook

> This requires the use of `fetchUserWithPermissions`.

```typescript
@PermissionRequired('perm')
```

| Context | Response |
| --- | --- |
| `ctx.user` is undefined | 401 - UNAUTHORIZED |
| `ctx.user.hasPerm('perm')` is false | 403 - FORBIDDEN |

```typescript
@PermissionRequired('perm', { redirect: '/login' })
```

| Context | Response |
| --- | --- |
| `ctx.user` is undefined | Redirects to `/login` (302 - FOUND) |
| `ctx.user.hasPerm('perm')` is false | 403 - FORBIDDEN |

*Example*
```typescript
import { Context, Get } from '@foal/core';
import { fetchUserWithPermissions, PermissionRequired } from '@foal/typeorm';
import { JWTRequired } from '@foal/jwt';

@JWTRequired({ user: fetchUserWithPermissions(User) })
export class ProductController {
  @Get('/products')
  @PermissionRequired('read-products')
  readProduct(ctx: Context) {
    return new HttpResponseOK([]);
  }
}
```

## BaseEntity Inheritance

> Available in Foal v1.8.0 onwards.

The classes `Permission`, `Group` and `UserWithPermissions` all extends the `BaseEntity` class so you can access its static and instance methods.

*Example*
```typescript
const perm = await Permission.findOneOrFail({ codeName: 'perm1' });
perm.name = 'Permission1';
await perm.save();
```

## Get All Users with a Given Permission

> Available in Foal v1.8.0 onwards.

The class `UserWithPermissions` provides a static method `withPerm` to get all users with a given permission. It returns all users that have this permission on their own or through the groups they belong to.

```typescript
@Entity()
class User extends UserWithPermissions {}
  
const users = await User.withPerm<User>('perm1');
```