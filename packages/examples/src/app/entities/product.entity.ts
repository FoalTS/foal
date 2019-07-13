import { Column, Entity, PrimaryGeneratedColumn } from '@foal/typeorm/node_modules/typeorm';

@Entity()
export class Product {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

}
