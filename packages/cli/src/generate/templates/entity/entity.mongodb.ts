// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class /* upperFirstCamelName */ extends BaseEntity {

  @ObjectIdColumn()
  _id: ObjectID;

}
