// 3p
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

// FoalTS
import { Permission } from './permission.entity';

@Entity()
export class Group {

  @PrimaryGeneratedColumn()
  // @ts-ignore : Property 'id' has no initializer and is not definitely assigned in theconstructor.
  id: number;

  @Column({ length: 80 })
  // @ts-ignore : Property 'name' has no initializer and is not definitely assigned in theconstructor.
  name: string;

  @ManyToMany(type => Permission)
  @JoinTable()
  // @ts-ignore : Property 'permissions' has no initializer and is not definitely assigned in theconstructor.
  permissions: Permission[];

}
