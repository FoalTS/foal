// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class /* upperFirstCamelName */ {

  @ObjectIdColumn()
  id: ObjectID;

}
