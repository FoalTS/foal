// import { hashPassword } from '@foal/core';
import { /*Column, */Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class User {

  @ObjectIdColumn()
  id: ObjectID;

  // @Column({ unique: true })
  // email: string;

  // @Column()
  // password: string;

  // async setPassword(password: string) {
  //   this.password = await hashPassword(password);
  // }

}
