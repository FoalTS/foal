import { restrictAccessToAdmin, restrictAccessToAuthenticated } from '@foal/authorization';
import { afterThatLog, Context, log, ObjectType, preHook, Service } from '@foal/core';
import { Sequelize, SequelizeService } from '@foal/sequelize';
import * as bcrypt from 'bcrypt-nodejs';

import { ConnectionService } from './connection.service';

import { User } from '../interfaces/user';

@Service()
@log('UserService1')
@log('UserService2')
@afterThatLog('UserService1 (post)')
@afterThatLog('UserService2 (post)')
// @postHook((ctx: RContext<User|User[]>) => delete ctx.result.password)
export class UserService extends SequelizeService<User> {
  constructor(protected connection: ConnectionService) {
    super('users', {
      isAdmin: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      password: { type: Sequelize.STRING, allowNull: false },
      username: { type: Sequelize.STRING, unique: true, allowNull: false },
    }, connection);
  }

  @preHook((ctx: Context) => ctx.body.isAdmin = false)
  @log('create1')
  @log('create2')
  @afterThatLog('create1 (post)')
  @afterThatLog('create2 (post)')
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

  public verifyPassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

}
