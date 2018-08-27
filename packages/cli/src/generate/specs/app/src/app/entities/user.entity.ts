import { AbstractUser/*, parsePassword*/ } from '@foal/core';
import { /*Column, */Entity } from 'typeorm';

@Entity()
export class User extends AbstractUser {

  // @Column({ unique: true })
  // // @ts-ignore : Property 'email' has no initializer and is not definitely assigned in theconstructor.
  // email: string;

  // @Column()
  // // @ts-ignore : Property 'password' has no initializer and is not definitely assigned in theconstructor.
  // password: string;

  // async setPassword(password: string) {
  //   this.password = await parsePassword(password);
  // }

}

export { Group, Permission } from '@foal/core';
