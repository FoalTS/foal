import { BaseEntity, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {

  @ObjectIdColumn()
  id: ObjectID;

}
