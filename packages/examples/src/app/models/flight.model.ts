import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Flight {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  destination: string;

}
