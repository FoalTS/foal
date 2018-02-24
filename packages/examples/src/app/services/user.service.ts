import { CheckPassword } from '@foal/authentication';
import { Context, ObjectType, Service } from '@foal/core';
import { Sequelize, SequelizeModelService, DefaultIdAndTimeStamps } from '@foal/sequelize';
import * as bcrypt from 'bcrypt-nodejs';

import { ConnectionService } from './connection.service';

import { User } from '../interfaces/user';

@Service()
export class UserService extends SequelizeModelService<User> implements CheckPassword<User> {
  constructor(protected connection: ConnectionService) {
    super('users', {
      isAdmin: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      password: { type: Sequelize.STRING, allowNull: false },
      username: { type: Sequelize.STRING, unique: true, allowNull: false },
    }, connection);
  }

  public createOne(data: User): Promise<User & DefaultIdAndTimeStamps> {
    return super.createOne({
      ...data,
      password: bcrypt.hashSync(data.password)
    });
  }

  public checkPassword(user: User, password: string): boolean {
    return bcrypt.compareSync(password, user.password);
  }

}
