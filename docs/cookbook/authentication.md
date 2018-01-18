# Authentication

**This doc is in progress.**

You can use passport for authentication as you would do with a regular express app. For access control you may use the package [`@foal/common`](../packages/common.md) which provides interesting hooks such as `@restrictAccessToAdmin` or `@restrictAccessToAuthenticated`.

## Example

In this example we'll be able to:
- create users (everyone),
- read users (authenticated only),
- delete users (admin only)

**Note**: For simplicity this demo does not include CSRF protection. You may be interested in using the [csurf middleware](https://github.com/expressjs/csurf) for that.

### Database connection service

`connection.service.ts`

```typescript
import { Service } from '@foal/core';
import { SequelizeConnectionService } from '@foal/sequelize';

@Service()
export class ConnectionService extends SequelizeConnectionService {
  constructor() {
    super('foal_examples', 'postgres', 'password', { dialect: 'postgres' });
  }
}
```

### User interface

`user.ts`

```typescript
export interface User {
  id: string;
  username: string;
  password: string;
}
```


### User connection service

`user.service.ts`

```typescript
import { restrictAccessToAdmin, restrictAccessToAuthenticated } from '@foal/common';
import { Context, ObjectType, preHook, Service } from '@foal/core';
import { Sequelize, SequelizeService } from '@foal/sequelize';
import * as bcrypt from 'bcrypt-nodejs';

import { ConnectionService } from './connection.service';

import { User } from '../interfaces/user';

@Service()
export class UserService extends SequelizeService<User> {
  constructor(protected connection: ConnectionService) {
    super('users', {
      isAdmin: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      password: { type: Sequelize.STRING, allowNull: false },
      username: { type: Sequelize.STRING, unique: true, allowNull: false },
    }, connection);
  }

  @preHook((ctx: Context) => ctx.body.isAdmin = false)
  public create(data: any, query: ObjectType): Promise<User | User[]> {
    return super.create({
      ...data,
      password: bcrypt.hashSync(data.password)
    }, query);
  }

  @restrictAccessToAuthenticated()
  public get(id: any, query: ObjectType): Promise<User> {
    return super.get(id, query);
  }

  @restrictAccessToAuthenticated()
  public getAll(query: ObjectType): Promise<User[]> {
    return super.getAll(query);
  }

  @restrictAccessToAdmin()
  public replace(id: any, data: any, query: ObjectType): Promise<User> {
    return super.replace(id, data, query);
  }

  @restrictAccessToAdmin()
  public modify(id: any, data: any, query: ObjectType): Promise<User> {
    return super.modify(id, data, query);
  }

  @restrictAccessToAdmin()
  public delete(id: any, query: ObjectType): Promise<any> {
    return super.delete(id, query);
  }

  public verifyPassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

}
```

Note that you should delete the password attribute before sending the user back to the client.

### Passport implementation

**TODO**