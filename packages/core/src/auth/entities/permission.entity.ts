import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
