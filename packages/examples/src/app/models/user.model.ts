import { parsePassword } from '@foal/password';
import { AbstractUser, Service } from '@foal/core';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends AbstractUser {

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

}
