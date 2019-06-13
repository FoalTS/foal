import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { hashPassword } from '@foal/core';
import { UserWithPermissions } from '@foal/typeorm';

@Entity()
export class User extends UserWithPermissions {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  async setPassword(password: string): Promise<void> {
    this.password = await hashPassword(password, { legacy: true });
  }

}

export { Group, Permission } from '@foal/typeorm';
