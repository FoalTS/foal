// 3p
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Permission {

  @PrimaryGeneratedColumn()
  // @ts-ignore : Property 'id' has no initializer and is not definitely assigned in theconstructor.
  id: number;

  @Column()
  // @ts-ignore : Property 'name' has no initializer and is not definitely assigned in theconstructor.
  name: string;

  @Column({ length: 100, unique: true })
  // @ts-ignore : Property 'codeName' has no initializer and is not definitely assigned in theconstructor.
  codeName: string;

}

@Entity()
export class Group {

  @PrimaryGeneratedColumn()
  // @ts-ignore : Property 'id' has no initializer and is not definitely assigned in theconstructor.
  id: number;

  @Column({ length: 80 })
  // @ts-ignore : Property 'name' has no initializer and is not definitely assigned in theconstructor.
  name: string;

  @Column({ length: 100, unique: true })
  // @ts-ignore : Property 'codeName' has no initializer and is not definitely assigned in theconstructor.
  codeName: string;

  @ManyToMany(type => Permission)
  @JoinTable()
  // @ts-ignore : Property 'permissions' has no initializer and is not definitely assigned in theconstructor.
  permissions: Permission[];

}

export abstract class User {

  @PrimaryGeneratedColumn()
  // @ts-ignore : Property 'id' has no initializer and is not definitely assigned in theconstructor.
  id: number;

  @ManyToMany(type => Group)
  @JoinTable()
  // @ts-ignore : Property 'groups' has no initializer and is not definitely assigned in theconstructor.
  groups: Group[];

  @ManyToMany(type => Permission)
  @JoinTable()
  // @ts-ignore : Property 'userPermissions' has no initializer and is not definitely assigned in theconstructor.
  userPermissions: Permission[];

  @Column({ unique: true })
  // @ts-ignore : Property 'email' has no initializer and is not definitely assigned in theconstructor.
  email: string;

  @Column()
  // @ts-ignore : Property 'password' has no initializer and is not definitely assigned in theconstructor.
  password: string;

  async setPassword(password: string): Promise<void> {
    this.password = `strong_${password}`;
  }

}
