import { AbstractUser, parsePassword } from '@foal/core';
import { BeforeInsert, Column, Entity } from 'typeorm';

@Entity()
export class User extends AbstractUser {

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  hashPassword() {
    parsePassword(this);
  }

}
