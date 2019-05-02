# Administrators & Roles

In simple applications, access control can be managed with static roles or even with an `isAdmin` column in the simplest cases.

## Admin and Non-Admins

If there are only two categories of users, administrators and non-administrators, a simple solution is to add an `isAdmin` column to the `user` table. Then authorization is handled by looking at the `isAdmin` property of the `User` objects.

_entities/user.entity.ts_

```typescript
import { Column, Entity } from 'typeorm';

@Entity()
export class User {

  @Column()
  isAdmin: boolean;

}
```

_hooks/admin-required.hook.ts_

```typescript
import { Context, Hook } from '@foal/core';

import { User } from '../entities';

export function AdminRequired() {
  return Hook((ctx: Context<User>) => {
    if (!ctx.user) {
      return new HttpResponseUnauthorized();
    }
    if (!ctx.user.isAdmin) {
      return new HttpResponseForbidden();
    }
  })
}
```

_app.controller.ts_

```typescript
import { Get, HttpResponseOK } from '@foal/core';

import { AdminRequired } from '../hooks';

export class AppController {
  private products = [ { id: 1, name: 'chair' } ];

  @Get('/products')
  @AdminRequired()
  readProducts() {
    return new HttpResponseOK(this.products);
  }
}
```

### Static Roles

If it exists more than two categories and/or a user can belong to several categories then defining a `roles` property can also be a solution.

_entities/user.entity.ts_

```typescript
import { Column, Entity } from 'typeorm';

@Entity()
export class User {

  @Column('simple-array')
  roles: string[];

}
```

_hooks/role-required.hook.ts_

```typescript
import { Context, Hook } from '@foal/core';

export function RoleRequired(role: string) {
  return Hook((ctx: Context<User>) => {
    if (!ctx.user) {
      return new HttpResponseUnauthorized();
    }
    if (!ctx.user.roles.includes(role)) {
      return new HttpResponseForbidden();
    }
  })
}
```

_app.controller.ts_

```typescript
import { Get, HttpResponseOK } from '@foal/core';

import { RoleRequired } from '../hooks';

export class AppController {
  private products = [ { id: 1, name: 'chair' } ];

  @Get('/products')
  @RoleRequired('admin')
  readProducts() {
    return new HttpResponseOK(this.products);
  }
}
```

