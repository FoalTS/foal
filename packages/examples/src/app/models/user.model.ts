import { AbstractUser, Config, parsePassword } from '@foal/core';
import { BeforeInsert, Column, createConnection, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends AbstractUser {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  hashPassword() {
    parsePassword(this);
  }

}

// To run with ts-node

// async function createUser(data: Partial<User>) {
//   refaire avec host et tout.
//   const config = getConfig('base');
//   const connection = await createConnection(config.database);
//   const user = connection.getRepository(User).create(data);
//   await user.save();
// }

// createUser({});
