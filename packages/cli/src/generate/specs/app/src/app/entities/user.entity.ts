import { AbstractUser/*, parsePassword*/ } from '@foal/core';
import { /*Column, */Entity } from 'typeorm';

@Entity()
export class User extends AbstractUser {

  // @Column({ unique: true })
  // email: string;

  // @Column()
  // password: string;

  // async setPassword(password: string) {
  //   this.password = await parsePassword(password);
  // }

}

export { Group, Permission } from '@foal/core';
