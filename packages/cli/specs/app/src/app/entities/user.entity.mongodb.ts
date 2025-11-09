import { BaseEntity, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {

  @ObjectIdColumn()
  _id: ObjectId;

}
