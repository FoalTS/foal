import { Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class User {

  @ObjectIdColumn()
  id: ObjectID;

}
