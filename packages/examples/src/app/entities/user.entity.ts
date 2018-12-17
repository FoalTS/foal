import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { UserWithPermissions, parsePassword } from '@foal/core';

@Entity()
export class User extends UserWithPermissions {

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

export { Group, Permission } from '@foal/core';
