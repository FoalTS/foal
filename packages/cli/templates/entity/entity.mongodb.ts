// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BaseEntity, Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity()
export class /* upperFirstCamelName */ extends BaseEntity {

  @ObjectIdColumn()
  _id: ObjectId;

}
