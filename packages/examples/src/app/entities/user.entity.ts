import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { AbstractUser, parsePassword } from '@foal/core';

@Entity()
export class User extends AbstractUser {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  async setPassword(password: string): Promise<void> {
    this.password = await parsePassword(password);
  }

}
