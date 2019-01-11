import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class /* upperFirstCamelName */ {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

}
