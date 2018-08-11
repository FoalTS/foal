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

// To run with ts-node

// async function createUser(data: Partial<User>) {
//   const connection = await createConnection();
//   const user = connection.getRepository(User).create(data);
//   await user.save();
// }

// createUser({});
