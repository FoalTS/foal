// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class TestFooBar extends BaseEntity {

  @ObjectIdColumn()
  id: ObjectID;

}
