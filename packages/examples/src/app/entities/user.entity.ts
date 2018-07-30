import { AbstractUser, parsePassword } from '@foal/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends AbstractUser {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  setPassword(password: string) {
    const o = { password };
    parsePassword(o);
    this.password = o.password;
  }

}

// To run with ts-node

// async function createUser(data: Partial<User>) {
//   const connection = await createConnection();
//   const user = connection.getRepository(User).create(data);
//   await user.save();
// }

// createUser({});
