import {
  DefaultIdAndTimeStamps,
  Sequelize,
  SequelizeConnectionService,
  SequelizeModelService
} from '@foal/sequelize';

export interface BaseUser {
  isAdmin: boolean;
}

export abstract class UserModelService<User, CreatingUser = User,
                                       IIdAndTimeStamps extends { id: any; } = DefaultIdAndTimeStamps, IdType = number>
                                       extends SequelizeModelService<User, CreatingUser, IIdAndTimeStamps, IdType> {
  constructor(schema: object, connection: SequelizeConnectionService,
              private parsers: ((data: CreatingUser) => void|Promise<void>)[] = []) {
    super('users', {
      ...schema,
      isAdmin: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
    }, connection);
  }

  public async createOne(data: CreatingUser): Promise<User & IIdAndTimeStamps> {
    for (const parser of this.parsers) {
      await parser(data);
    }
    return super.createOne(data);
  }

  public async createMany(records: CreatingUser[]): Promise<(User & IIdAndTimeStamps)[]> {
    for (const record of records) {
      for (const parser of this.parsers) {
        await parser(record);
      }
    }
    return super.createMany(records);
  }

}
