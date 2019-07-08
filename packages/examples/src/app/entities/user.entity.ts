import { Column, Entity, PrimaryGeneratedColumn } from '@foal/typeorm/node_modules/typeorm';

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
    this.password = await hashPassword(password);
  }

}

export { Group, Permission } from '@foal/typeorm';
