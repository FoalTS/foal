// import { parsePassword } from '@foal/core';
import { UserWithPermissions } from '@foal/typeorm';
import { /*Column, */Entity } from 'typeorm';

@Entity()
export class User extends UserWithPermissions {

  // @Column({ unique: true })
  // email: string;

  // @Column()
  // password: string;

  // async setPassword(password: string) {
  //   this.password = await parsePassword(password);
  // }

}

export { Group, Permission } from '@foal/typeorm';
