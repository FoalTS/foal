import { restrictAccessToAdmin, restrictAccessToAuthenticated } from '@foal/authorization';
import { Context, ObjectType, preHook, Service } from '@foal/core';
import { Sequelize, SequelizeService } from '@foal/sequelize';

import { ConnectionService } from './connection.service';

import { User } from '../interfaces/user';

@Service()
export class UserService extends SequelizeService<User> {
  constructor(protected connection: ConnectionService) {
    super('users', {
      isAdmin: Sequelize.BOOLEAN,
      password: Sequelize.STRING,
      username: Sequelize.STRING,
    }, connection);
  }

  @preHook((ctx: Context) => ctx.body.isAdmin = false)
  // @postHook((ctx: RContext<User>) => delete ctx.result.password)
  public create(data: any, query: ObjectType): Promise<User | User[]> {
    return super.create(data, query);
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
  public update(id: any, data: any, query: ObjectType): Promise<User> {
    return super.update(id, data, query);
  }

  @restrictAccessToAdmin()
  public patch(id: any, data: any, query: ObjectType): Promise<User> {
    return super.patch(id, data, query);
  }

  @restrictAccessToAdmin()
  public delete(id: any, query: ObjectType): Promise<any> {
    return super.delete(id, query);
  }

}
