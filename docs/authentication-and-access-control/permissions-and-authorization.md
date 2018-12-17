# Permissions and Authorization

Authorization, also known as Access Control, is mediating access to resources on the basis of identity. It answers the question *What the user is allowed to do?*. In this way it differs from authentication which, upstream, answers the question *Who is the user?*.

## Simple Scenarios

In simple applications, access control can be managed with static roles or even with an `isAdmin` column in the simplest cases.

### Admin and Non-Admins

If there are only two categories of users, administrators and non-administrators, a simple solution can be to add an `isAdmin` column to the `user` table. Then authorization is handled by looking at the `isAdmin` property of the User objects.

*Example*
```typescript
// src/app/entities/user.entity.ts
import { UserWithPermissions } from '@foal/typeorm';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends UserWithPermissions {

  @Column()
  isAdmin: boolean;

}
```

```typescript
// src/app/services/my-service.service.ts
import { PermissionDenied } from '@foal/core';

import { User } from '../entities';

export class MyService {
  private adminSecret = 'my secret';

  getSecret(authenticatedUser: User) {
    if (authenticatedUser.isAdmin) {
      return this.adminSecret;
    }
    throw new PermissionDenied();
  }
}
```

### Static Roles

If it exists more than two categories and/or a user can belong to several categories then defining a `roles` property can also be a solution.

*Example*
```typescript
// src/app/entities/user.entity.ts
import { UserWithPermissions } from '@foal/typeorm';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends UserWithPermissions {

  @Column('simple-array')
  roles: string[];

}
```

```typescript
// src/app/services/my-service.service.ts
import { PermissionDenied } from '@foal/core';

import { User } from '../entities';

export class MyService {
  private adminSecret = 'my secret';

  getSecret(authenticatedUser: User) {
    if (authenticatedUser.roles.includes('admin')) {
      return this.adminSecret;
    }
    throw new PermissionDenied();
  }
}
```

## Permissions

In more complex applications, access control is managed through permissions and groups.

### The Permission Entity

| Property name | Type | Database Link |
| --- | --- | --- |
| id | number | Primary auto generated key |
| name | string | |
| codeName | string | Unique, Length: 100 |

*Example*
```typescript
// src/app/services/my-service.service.ts
import { PermissionDenied } from '@foal/core';

import { User } from '../entities';

export class MyService {
  private adminSecret = 'my secret';

  getSecret(authenticatedUser: User) {
    if (authenticatedUser.hasPerm('access-secret')) {
      return this.adminSecret;
    }
    throw new PermissionDenied();
  }
}
```

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
foal run-script create-perm name="Permission to access the secret" codeName="access-secret"
```

## Groups

Groups are used to categorize users. A user can belong to several groups and a group can have several users.

A group can have permissions. They then apply to all its users.

> Examples of *groups* are the "Free", "Pro" and "Enterprise" plans of a SaaS application. Depending of the price paid by the customer, he/she has access to certain features whose access are managed by *permissions*.

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
foal run-script create-perm name="Permission to delete users" codeName="delete-users"
foal run-script create-group name="Administrators" codeName="admin" permissions='[ "delete-users" ]'
```

## Users

## Relations between Users, Groups and Permissions

![Permissions, groups and users](./permissions-groups-and-users.png)

## The `hasPerm` Method

The `hasPerm(permissionCodeName: string)` method of the `User` class returns true if one of these conditions is true:
- The user has the required permission.
- The user belongs to a group that has the required permission.

## Creating Users with Groups and Permissions with a Shell Script (CLI)

```sh
npm run build:scripts
foal run-script create-user userPermissions='[ "my-first-perm" ]' groups='[ "my-group" ]'
```