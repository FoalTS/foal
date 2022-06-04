import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from '@foal/typeorm/node_modules/typeorm';

@Entity()
export class Product extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

}
