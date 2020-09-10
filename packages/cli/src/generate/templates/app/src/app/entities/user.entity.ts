// import { hashPassword } from '@foal/core';
import { BaseEntity, /*Column, */Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  // @Column({ unique: true })
  // email: string;

  // @Column()
  // password: string;

  // async setPassword(password: string) {
  //   this.password = await hashPassword(password);
  // }

}
