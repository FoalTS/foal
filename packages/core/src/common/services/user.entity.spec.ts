import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  // @ts-ignore : Property 'id' has no initializer and is not definitely assigned in theconstructor.
  id: number;

  @Column()
  // @ts-ignore : Property 'firstName' has no initializer and is not definitely assigned in theconstructor.
  firstName: string;

  @Column()
  // @ts-ignore : Property 'lastName' has no initializer and is not definitely assigned in theconstructor.
  lastName: string;

  @Column({ default: false })
  // @ts-ignore : Property 'isAdmin' has no initializer and is not definitely assigned in theconstructor.
  isAdmin: boolean;
}
