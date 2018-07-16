import { AbstractUser, parsePassword } from '@foal/core';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends AbstractUser {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  setPassword(password: string) {
    // TODO: use setPassword instead of BeforeInsert
  }

  @BeforeInsert()
  hashPassword() {
    parsePassword(this);
  }

}

// To run with ts-node

// async function createUser(data: Partial<User>) {
//   const connection = await createConnection();
//   const user = connection.getRepository(User).create(data);
//   await user.save();
// }

// createUser({});
