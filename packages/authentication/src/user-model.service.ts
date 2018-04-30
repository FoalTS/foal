import {
  DefaultIdAndTimeStamps,
  Sequelize,
  SequelizeConnectionService,
  SequelizeModelService
} from '@foal/sequelize';

export abstract class UserModelService<User, CreatingUser = User,
                                       IIdAndTimeStamps extends { id: any; } = DefaultIdAndTimeStamps, IdType = number>
                                       extends SequelizeModelService<User, CreatingUser, IIdAndTimeStamps, IdType> {
  constructor(schema: object, connection: SequelizeConnectionService,
              private parsers: ((data: CreatingUser) => void)[] = []) {
    super('users', {
      ...schema,
      isAdmin: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
    }, connection);
  }

  public createOne(data: CreatingUser): Promise<User & IIdAndTimeStamps> {
    this.parsers.forEach(parser => parser(data));
    return super.createOne(data);
  }

  public createMany(records: CreatingUser[]): Promise<(User & IIdAndTimeStamps)[]> {
    for (const record of records) {
      this.parsers.forEach(parser => parser(record));
    }
    return super.createMany(records);
  }

}
