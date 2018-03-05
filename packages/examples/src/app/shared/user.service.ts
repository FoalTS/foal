import { CheckPassword } from '@foal/authentication';
import { Service } from '@foal/core';
import { DefaultIdAndTimeStamps, Sequelize, SequelizeModelService } from '@foal/sequelize';
import * as bcrypt from 'bcrypt-nodejs';

import { ConnectionService } from './connection.service';
import { User } from './user.interface';

@Service()
export class UserService extends SequelizeModelService<User> implements CheckPassword<User> {
  constructor(protected connection: ConnectionService) {
    super('users', {
      email: { type: Sequelize.STRING, unique: true, allowNull: false },
      isAdmin: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      password: { type: Sequelize.STRING, allowNull: false },
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
